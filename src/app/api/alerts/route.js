import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Budget from '@/lib/models/Budget';
import Transaction from '@/lib/models/Transaction';
import { verifyToken } from '@/lib/auth';

const quotes = [
  "A penny saved is a penny earned.",
  "Do not save what is left after spending, but spend what is left after saving.",
  "Wealth consists not in having great possessions, but in having few wants.",
  "Too many people spend money they haven't earned, to buy things they don't want, to impress people that they don't like.",
  "The quickest way to double your money is to fold it over and put it back in your pocket."
];

export async function GET(req) {
  await connectDB();
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ msg: 'Not authorized' }, { status: 401 });

  try {
    const alerts = [];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    alerts.push({ type: 'quote', message: randomQuote });

    const currentMonth = new Date().toISOString().slice(0, 7);
    const budgets = await Budget.find({ userId: user.id, month: currentMonth });
    
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const transactions = await Transaction.find({
        userId: user.id,
        type: 'expense',
        date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const categorySpends = {};
    transactions.forEach(t => {
        categorySpends[t.category] = (categorySpends[t.category] || 0) + Number(t.amount);
    });

    budgets.forEach(b => {
        const spent = categorySpends[b.category] || 0;
        if (spent > b.amount) {
            alerts.push({ type: 'error', message: `You have exceeded your budget for ${b.category}!` });
        } else if (spent > b.amount * 0.8) {
            alerts.push({ type: 'warning', message: `You've used ${((spent/b.amount)*100).toFixed(0)}% of your ${b.category} budget.` });
        } else {
            alerts.push({ type: 'success', message: `Great job keeping ${b.category} expenses low!` });
        }
    });

    return NextResponse.json(alerts);
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
  }
}
