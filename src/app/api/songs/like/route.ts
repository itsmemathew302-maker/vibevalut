import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Song from '@/models/Song';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Sign in required.' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { songId } = await req.json();

    if (!songId) {
      return NextResponse.json({ success: false, error: 'Song ID is required' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const song = await Song.findById(songId);
    if (!song) {
      return NextResponse.json({ success: false, error: 'Song not found' }, { status: 404 });
    }

    const isFav = user.favorites.includes(songId);

    if (isFav) {
      // Unlike
      user.favorites = user.favorites.filter((id) => id.toString() !== songId);
      song.likesCount = Math.max(0, song.likesCount - 1);
    } else {
      // Like
      user.favorites.push(songId);
      song.likesCount += 1;
    }

    await user.save();
    await song.save();

    return NextResponse.json({
      success: true,
      liked: !isFav,
      likesCount: song.likesCount
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
