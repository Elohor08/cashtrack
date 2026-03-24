import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
  await connectDB();
  
  const userPayload = verifyToken(req);
  if (!userPayload) {
    return NextResponse.json({ msg: 'No token, authorization denied' }, { status: 401 });
  }

  try {
    const user = await User.findById(userPayload.id).select('-password');
    if (!user) {
      return NextResponse.json({ msg: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ msg: 'Server error' }, { status: 500 });
  }
}
