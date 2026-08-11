import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Song from '@/models/Song';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const { songId } = await req.json();
    if (!songId) {
      return NextResponse.json({ success: false, error: 'Song ID is required' }, { status: 400 });
    }

    // Increment play count (this happens even for guests)
    const song = await Song.findByIdAndUpdate(
      songId, 
      { $inc: { playsCount: 1 } },
      { new: true }
    );

    if (!song) {
      return NextResponse.json({ success: false, error: 'Song not found' }, { status: 404 });
    }

    // Update history for logged-in user
    const session = await getServerSession(authOptions);
    if (session && session.user) {
      const userId = (session.user as any).id;
      
      const user = await User.findById(userId);
      if (user) {
        // Filter out if duplicate song exists in history, to push it to front
        user.recentlyPlayed = user.recentlyPlayed.filter(
          (item) => item.songId.toString() !== songId
        );

        user.recentlyPlayed.unshift({
          songId,
          playedAt: new Date()
        });

        // Cap history to last 30 songs
        if (user.recentlyPlayed.length > 30) {
          user.recentlyPlayed = user.recentlyPlayed.slice(0, 30);
        }

        await user.save();
      }
    }

    return NextResponse.json({
      success: true,
      playsCount: song.playsCount
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
