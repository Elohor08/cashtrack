import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Pocket from '@/lib/models/Pocket';
import Transaction from '@/lib/models/Transaction';
import { verifyToken } from '@/lib/auth';

export async function PUT(req, { params }) {
  await connectDB();
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ msg: 'Not authorized' }, { status: 401 });

  try {
    const { id } = await params;
    const { name, type, balance } = await req.json();
    
    let pocket = await Pocket.findById(id);
    if (!pocket) return NextResponse.json({ msg: 'Pocket not found' }, { status: 404 });
    if (pocket.userId.toString() !== user.id) return NextResponse.json({ msg: 'Not authorized' }, { status: 401 });

    pocket.name = name || pocket.name;
    pocket.type = type || pocket.type;
    if (balance !== undefined) pocket.balance = balance;

    pocket = await Pocket.findByIdAndUpdate(id, { $set: pocket }, { new: true });
    return NextResponse.json(pocket);
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectDB();
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ msg: 'Not authorized' }, { status: 401 });

  try {
    const { id } = await params;
    const pocket = await Pocket.findById(id);
    if (!pocket) return NextResponse.json({ msg: 'Pocket not found' }, { status: 404 });
    if (pocket.userId.toString() !== user.id) return NextResponse.json({ msg: 'Not authorized' }, { status: 401 });

    await Transaction.deleteMany({ pocketId: id });
    await Pocket.findByIdAndDelete(id);
    return NextResponse.json({ msg: 'Pocket removed' });
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
  }
}
