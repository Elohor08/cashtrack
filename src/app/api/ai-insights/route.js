import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transaction from '@/lib/models/Transaction';
import { verifyToken } from '@/lib/auth';
import OpenAI from 'openai';

let openai;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function GET(req) {
  await connectDB();
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ msg: 'Not authorized' }, { status: 401 });

  try {
    if (!openai) {
      return NextResponse.json({ advice: "OpenAI API key is missing. Add it to .env to enable AI insights." });
    }

    const transactions = await Transaction.find({ userId: user.id }).sort({ date: -1 }).limit(50);
    
    let income = 0;
    let expense = 0;
    const expenseCategories = {};

    transactions.forEach(t => {
      if (t.type === 'income') {
        income += Number(t.amount);
      } else {
        expense += Number(t.amount);
        expenseCategories[t.category] = (expenseCategories[t.category] || 0) + Number(t.amount);
      }
    });

    const prompt = `Based on the user's last 50 transactions, here is their summary:
    Total Income: $${income}
    Total Expense: $${expense}
    Top Expense Categories: ${JSON.stringify(expenseCategories)}
    
    Provide a concise, personalized piece of financial advice (under 3 sentences) to help them save money or build better habits based on this breakdown.`;

    const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
    });

    return NextResponse.json({ advice: completion.choices[0].message.content });
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ msg: 'Server Error from AI API' }, { status: 500 });
  }
}
