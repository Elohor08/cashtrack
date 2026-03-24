import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transaction from '@/lib/models/Transaction';
import Pocket from '@/lib/models/Pocket';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
  await connectDB();
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ msg: 'Not authorized' }, { status: 401 });

  try {
    const transactions = await Transaction.find({ userId: user.id }).sort({ date: -1 });
    return NextResponse.json(transactions);
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
    const { pocketId, amount, category, date, type } = await req.json();
    const newTransaction = new Transaction({
      pocketId,
      userId: user.id,
      amount,
      category,
      date: date || Date.now(),
      type
    });
    const transaction = await newTransaction.save();

    // Update pocket balance
    const pocket = await Pocket.findById(pocketId);
    if (pocket) {
        if (type === 'income') pocket.balance += Number(amount);
        else pocket.balance -= Number(amount);
        await pocket.save();
    }

    return NextResponse.json(transaction);
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
  }
}
