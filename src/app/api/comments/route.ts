import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Comment from '@/models/Comment';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: Fetch comments for a specific song
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const songId = searchParams.get('songId');

    if (!songId) {
      return NextResponse.json({ success: false, error: 'Song ID is required' }, { status: 400 });
    }

    const comments = await Comment.find({ songId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, comments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Add comment & rating for a song
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { songId, content, rating } = body;

    if (!songId || !content || !rating) {
      return NextResponse.json({ success: false, error: 'Required fields missing' }, { status: 400 });
    }

    const newComment = await Comment.create({
      songId,
      userId: (session.user as any).id,
      userName: session.user.name || 'User',
      userImage: session.user.image || '',
      content,
      rating: parseInt(rating) || 5
    });

    return NextResponse.json({ success: true, comment: newComment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
