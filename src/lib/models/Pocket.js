import mongoose from 'mongoose';

const PocketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  balance: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Pocket || mongoose.model('Pocket', PocketSchema);
