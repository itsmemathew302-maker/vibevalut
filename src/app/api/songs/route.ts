import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Song from '@/models/Song';
import Artist from '@/models/Artist';
import Album from '@/models/Album';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: Fetch songs (paginated, filtered, searched)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const genre = searchParams.get('genre');
    const artistId = searchParams.get('artistId');
    const albumId = searchParams.get('albumId');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'createdAt'; // or 'playsCount'

    const query: any = {};

    if (genre && genre !== 'All') {
      query.genres = { $in: [genre] };
    }

    if (artistId) {
      query.artistId = artistId;
    }

    if (albumId) {
      query.albumId = albumId;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { artistName: { $regex: search, $options: 'i' } },
        { albumTitle: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const songs = await Song.find(query)
      .sort(sort === 'playsCount' ? { playsCount: -1 } : { createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Song.countDocuments(query);

    return NextResponse.json({
      success: true,
      songs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Add new song (Admin only)
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin privileges required.' }, { status: 403 });
    }

    const body = await req.json();
    const { title, artistName, artistId, albumTitle, albumId, audioUrl, coverUrl, duration, genres, lyrics } = body;

    if (!title || !artistId || !artistName || !audioUrl || !coverUrl) {
      return NextResponse.json({ success: false, error: 'Required fields missing' }, { status: 400 });
    }

    // Verify Artist exists or create one
    let artist = await Artist.findById(artistId);
    if (!artist) {
      // Fallback create
      artist = await Artist.create({
        _id: artistId,
        name: artistName,
        imageUrl: coverUrl,
        genres: genres || [],
      });
    }

    // If album name is given and no albumId, verify or create
    let finalAlbumId = albumId;
    if (albumTitle && !finalAlbumId) {
      let album = await Album.findOne({ title: albumTitle, artistId });
      if (!album) {
        album = await Album.create({
          title: albumTitle,
          artistId,
          artistName,
          coverUrl,
          genres: genres || [],
          songs: []
        });
      }
      finalAlbumId = album._id;
    }

    const newSong = await Song.create({
      title,
      artistId,
      artistName,
      albumId: finalAlbumId || null,
      albumTitle: albumTitle || '',
      audioUrl,
      coverUrl,
      duration: duration || 0,
      lyrics: lyrics || '',
      genres: genres || [],
      playsCount: 0,
      likesCount: 0
    });

    // Link song to Album
    if (finalAlbumId) {
      await Album.findByIdAndUpdate(finalAlbumId, { $push: { songs: newSong._id } });
    }

    return NextResponse.json({ success: true, song: newSong }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
