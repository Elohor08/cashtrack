import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Pocket from '@/lib/models/Pocket';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
  await connectDB();
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ msg: 'Not authorized' }, { status: 401 });

  try {
    const pockets = await Pocket.find({ userId: user.id }).sort({ createdAt: -1 });
    return NextResponse.json(pockets);
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ msg: 'Not authorized' }, { status: 401 });

  try {
    const { name, type, balance } = await req.json();
    const newPocket = new Pocket({
      userId: user.id,
      name,
      type,
      balance: balance || 0
    });
    const pocket = await newPocket.save();
    return NextResponse.json(pocket);
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
  }
}
