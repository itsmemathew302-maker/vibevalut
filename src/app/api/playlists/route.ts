import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Playlist from '@/models/Playlist';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: Fetch user playlists / public playlists
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const playlistId = searchParams.get('id');

    if (playlistId) {
      const playlist = await Playlist.findById(playlistId).populate('songs');
      if (!playlist) {
        return NextResponse.json({ success: false, error: 'Playlist not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, playlist });
    }

    const query: any = {};
    if (userId) {
      query.userId = userId;
    } else if (session?.user) {
      query.userId = (session.user as any).id;
    } else {
      query.isPublic = true;
    }

    const playlists = await Playlist.find(query).sort({ updatedAt: -1 });
    return NextResponse.json({ success: true, playlists });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create playlist
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { name, description, coverUrl, isPublic } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: 'Playlist name is required' }, { status: 400 });
    }

    const newPlaylist = await Playlist.create({
      name,
      description: description || '',
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17',
      userId,
      userName: session.user.name || 'User',
      songs: [],
      isPublic: isPublic !== undefined ? isPublic : true,
      playsCount: 0
    });

    // Add reference to User
    await User.findByIdAndUpdate(userId, { $push: { playlists: newPlaylist._id } });

    return NextResponse.json({ success: true, playlist: newPlaylist }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Edit playlist details or update track collection
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { playlistId, name, description, coverUrl, isPublic, songId, action } = body;

    if (!playlistId) {
      return NextResponse.json({ success: false, error: 'Playlist ID is required' }, { status: 400 });
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return NextResponse.json({ success: false, error: 'Playlist not found' }, { status: 404 });
    }

    // Auth check
    if (playlist.userId.toString() !== userId) {
      return NextResponse.json({ success: false, error: 'Access Denied. You do not own this playlist.' }, { status: 403 });
    }

    // Toggle track addition/removal
    if (songId && action) {
      if (action === 'add') {
        if (!playlist.songs.includes(songId)) {
          playlist.songs.push(songId);
        }
      } else if (action === 'remove') {
        playlist.songs = playlist.songs.filter((id) => id.toString() !== songId);
      }
    } else {
      // Direct edits
      if (name) playlist.name = name;
      if (description !== undefined) playlist.description = description;
      if (coverUrl) playlist.coverUrl = coverUrl;
      if (isPublic !== undefined) playlist.isPublic = isPublic;
    }

    await playlist.save();
    return NextResponse.json({ success: true, playlist });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Delete playlist
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(req.url);
    const playlistId = searchParams.get('id');

    if (!playlistId) {
      return NextResponse.json({ success: false, error: 'Playlist ID is required' }, { status: 400 });
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return NextResponse.json({ success: false, error: 'Playlist not found' }, { status: 404 });
    }

    // Auth check
    if (playlist.userId.toString() !== userId) {
      return NextResponse.json({ success: false, error: 'Access Denied.' }, { status: 403 });
    }

    await Playlist.findByIdAndDelete(playlistId);
    
    // Remove reference from User
    await User.findByIdAndUpdate(userId, { $pull: { playlists: playlistId } });

    return NextResponse.json({ success: true, message: 'Playlist deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
