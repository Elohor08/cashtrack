import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Budget from '@/lib/models/Budget';
import { verifyToken } from '@/lib/auth';

export async function PUT(req, { params }) {
  await connectDB();
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ msg: 'Not authorized' }, { status: 401 });

  try {
    const { id } = await params;
    const { category, amount, month } = await req.json();
    
    let budget = await Budget.findById(id);
    if (!budget) return NextResponse.json({ msg: 'Budget not found' }, { status: 404 });
    if (budget.userId.toString() !== user.id) return NextResponse.json({ msg: 'Not authorized' }, { status: 401 });

    budget.category = category || budget.category;
    if (amount !== undefined) budget.amount = amount;
    budget.month = month || budget.month;

    budget = await Budget.findByIdAndUpdate(id, { $set: budget }, { new: true });
    return NextResponse.json(budget);
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
    const budget = await Budget.findById(id);
    if (!budget) return NextResponse.json({ msg: 'Budget not found' }, { status: 404 });
    if (budget.userId.toString() !== user.id) return NextResponse.json({ msg: 'Not authorized' }, { status: 401 });

    await Budget.findByIdAndDelete(id);
    return NextResponse.json({ msg: 'Budget removed' });
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
  }
}
