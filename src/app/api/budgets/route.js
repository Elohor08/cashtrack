import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Budget from '@/lib/models/Budget';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
  await connectDB();
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ msg: 'Not authorized' }, { status: 401 });

  try {
    const budgets = await Budget.find({ userId: user.id }).sort({ month: -1 });
    return NextResponse.json(budgets);
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
    const { category, amount, month } = await req.json();
    const newBudget = new Budget({
      userId: user.id,
      category,
      amount,
      month
    });
    const budget = await newBudget.save();
    return NextResponse.json(budget);
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
  }
}
