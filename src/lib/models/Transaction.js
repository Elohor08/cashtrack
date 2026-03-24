import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  pocketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pocket', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['income', 'expense'], required: true }
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
