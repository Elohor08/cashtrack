"use client";
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import axios from 'axios';
import { Plus, Trash2, Receipt, TrendingUp, TrendingDown } from 'lucide-react';

const Transactions = () => {
  const { transactions, pockets, fetchData } = useData();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    pocketId: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/transactions', formData);
      setShowModal(false);
      setFormData({
        pocketId: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        type: 'expense'
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
        try {
            await axios.delete(`/api/transactions/${id}`);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    }
  };

  const categories = formData.type === 'expense' 
    ? ['Food', 'Transport', 'Bills', 'Entertainment', 'Shopping', 'Health', 'Other']
    : ['Salary', 'Business', 'Gift', 'Investment', 'Other'];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Transactions</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Add Transaction</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {transactions.length > 0 ? (
           <div className="divide-y divide-gray-100">
             {transactions.map(t => {
                const pocket = pockets.find(p => p._id === t.pocketId);
                return (
                 <div key={t._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition-colors group">
                   <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                     <div className={`p-3 rounded-xl ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                         {t.type === 'income' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6"/>}
                     </div>
                     <div>
                       <p className="font-bold text-gray-800 text-lg">{t.category}</p>
                       <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>{new Date(t.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="font-medium">{pocket ? pocket.name : 'Unknown Pocket'}</span>
                       </div>
                     </div>
                   </div>
                   <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4 pl-14 sm:pl-0">
                     <span className={`font-bold text-lg ${t.type === 'income' ? 'text-emerald-500' : 'text-gray-800'}`}>
                       {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                     </span>
                     <button onClick={() => handleDelete(t._id)} className="text-gray-400 hover:text-red-500 p-2 lg:opacity-0 group-hover:opacity-100 transition-opacity bg-gray-50 rounded-lg">
                         <Trash2 className="w-5 h-5" />
                     </button>
                   </div>
                 </div>
               )
             })}
           </div>
        ) : (
             <div className="p-12 flex flex-col items-center justify-center text-gray-400">
                <Receipt className="w-12 h-12 mb-3 text-gray-300" />
                <p>No transactions found. Add one to get started!</p>
            </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-4">Add Transaction</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="grid grid-cols-2 gap-2 mb-4">
                  <button type="button" onClick={() => setFormData({...formData, type: 'expense'})} className={`py-2 rounded-xl font-medium transition-colors ${formData.type === 'expense' ? 'bg-rose-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Expense</button>
                  <button type="button" onClick={() => setFormData({...formData, type: 'income'})} className={`py-2 rounded-xl font-medium transition-colors ${formData.type === 'income' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Income</button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                    <input 
                    type="number" 
                    required 
                    step="0.01"
                    min="0.01"
                    className="w-full pl-8 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                    placeholder="0.00"
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pocket</label>
                <select 
                  required
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-gray-100 disabled:text-gray-400"
                  value={formData.pocketId}
                  onChange={(e) => setFormData({...formData, pocketId: e.target.value})}
                  disabled={pockets.length === 0}
                >
                  <option value="" disabled>Select a pocket</option>
                  {pockets.map(p => (
                      <option key={p._id} value={p._id}>{p.name} ({p.type})</option>
                  ))}
                </select>
                {pockets.length === 0 && <p className="text-xs text-red-500 mt-1">Please create a pocket first!</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  required
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  required 
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={pockets.length===0} className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 shadow-sm transition-colors disabled:opacity-50">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;
