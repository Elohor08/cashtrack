"use client";
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import axios from 'axios';
import { Plus, Trash2, PieChart } from 'lucide-react';

const Budgets = () => {
  const { budgets, transactions, fetchData } = useData();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: new Date().toISOString().slice(0, 7)
  });

  const categories = ['Food', 'Transport', 'Bills', 'Entertainment', 'Shopping', 'Health', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/budgets', formData);
      setShowModal(false);
      setFormData({
        category: '',
        amount: '',
        month: new Date().toISOString().slice(0, 7)
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
        try {
            await axios.delete(`/api/budgets/${id}`);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    }
  };

  const getSpentAmount = (category, monthStr) => {
      const start = new Date(monthStr + '-01T00:00:00Z');
      const year = parseInt(monthStr.split('-')[0]);
      const month = parseInt(monthStr.split('-')[1]);
      const end = new Date(year, month, 0, 23, 59, 59);

      return transactions
        .filter(t => t.type === 'expense' && t.category === category && new Date(t.date) >= start && new Date(t.date) <= end)
        .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Budgets</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>New Budget</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {budgets.map(budget => {
            const spent = getSpentAmount(budget.category, budget.month);
            const percentage = Math.min((spent / budget.amount) * 100, 100);
            const isOver = spent > budget.amount;

            return (
              <div key={budget._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{budget.category}</h3>
                    <p className="text-sm text-gray-500">{budget.month}</p>
                  </div>
                  <button onClick={() => handleDelete(budget._id)} className="text-gray-400 hover:text-red-500 p-2 bg-gray-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mb-2 flex justify-between items-end">
                    <div>
                        <span className={`text-2xl font-extrabold ${isOver ? 'text-red-600' : 'text-gray-800'}`}>${spent.toFixed(2)}</span>
                        <span className="text-gray-500 ml-1">/ ${budget.amount.toFixed(2)}</span>
                    </div>
                    <span className={`text-sm font-medium ${isOver ? 'text-red-600' : 'text-emerald-600'}`}>
                        {percentage.toFixed(0)}%
                    </span>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${isOver ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                {isOver && <p className="text-red-500 text-sm mt-2 font-medium">Over budget by ${(spent - budget.amount).toFixed(2)}!</p>}
              </div>
            );
        })}
        
        {budgets.length === 0 && (
             <div className="col-span-full bg-white p-12 rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                <PieChart className="w-12 h-12 mb-3 text-gray-300" />
                <p>No budgets set up. Start planning your expenses!</p>
            </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-4">Create Budget</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget Limit</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                    <input 
                    type="number" 
                    required 
                    min="1"
                    className="w-full pl-8 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                    placeholder="0.00"
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <input 
                  type="month" 
                  required 
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.month}
                  onChange={(e) => setFormData({...formData, month: e.target.value})}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 shadow-sm transition-colors">Save Budget</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Budgets;
