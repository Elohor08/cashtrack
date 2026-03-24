import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const { name, email, password } = body;

    let user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({ msg: 'User already exists' }, { status: 400 });
    }

    user = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5 days' });

    return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ msg: 'Server error' }, { status: 500 });
  }
}
