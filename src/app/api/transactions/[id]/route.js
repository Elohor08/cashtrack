import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transaction from '@/lib/models/Transaction';
import Pocket from '@/lib/models/Pocket';
import { verifyToken } from '@/lib/auth';

export async function DELETE(req, { params }) {
  await connectDB();
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ msg: 'Not authorized' }, { status: 401 });

  try {
    const { id } = await params;
    const transaction = await Transaction.findById(id);
    if (!transaction) return NextResponse.json({ msg: 'Transaction not found' }, { status: 404 });
    if (transaction.userId.toString() !== user.id) return NextResponse.json({ msg: 'Not authorized' }, { status: 401 });

    // Reverse pocket balance
    const pocket = await Pocket.findById(transaction.pocketId);
    if (pocket) {
        if (transaction.type === 'income') pocket.balance -= Number(transaction.amount);
        else pocket.balance += Number(transaction.amount);
        await pocket.save();
    }

    await Transaction.findByIdAndDelete(id);
    return NextResponse.json({ msg: 'Transaction removed' });
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
  }
}
