import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const { email, password } = body;

    let user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ msg: 'Invalid Credentials' }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ msg: 'Invalid Credentials' }, { status: 400 });
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5 days' });

    return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email } }, { status: 200 });
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ msg: 'Server error' }, { status: 500 });
  }
}
