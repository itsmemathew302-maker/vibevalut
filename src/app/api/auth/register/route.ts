import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { name, email, password, adminSecret } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Check if email already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'Email is already registered' }, { status: 400 });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Determine user role based on adminSecret match
    let role: 'user' | 'admin' = 'user';
    if (adminSecret && adminSecret === process.env.ADMIN_SECRET_KEY) {
      role = 'admin';
    }

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      image: '',
      role,
      favorites: [],
      followedArtists: [],
      playlists: [],
      recentlyPlayed: [],
    });

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      }
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
