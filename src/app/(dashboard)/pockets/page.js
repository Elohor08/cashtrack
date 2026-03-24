"use client";
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import axios from 'axios';
import { Wallet, Plus, Trash2, Edit } from 'lucide-react';

const Pockets = () => {
  const { pockets, fetchData } = useData();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'income', balance: 0 });
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/pockets/${editingId}`, formData);
      } else {
        await axios.post('/api/pockets', formData);
      }
      setShowModal(false);
      setFormData({ name: '', type: 'income', balance: 0 });
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (pocket) => {
    setFormData({ name: pocket.name, type: pocket.type, balance: pocket.balance });
    setEditingId(pocket._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure? This will also delete all linked transactions.")) {
        try {
            await axios.delete(`/api/pockets/${id}`);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pockets</h2>
        <button 
          onClick={() => { setEditingId(null); setFormData({name: '', type: 'income', balance: 0}); setShowModal(true); }}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Add Pocket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pockets.map(pocket => (
          <div key={pocket._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-2 h-full ${pocket.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            <div className="flex justify-between items-start mb-4 pl-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{pocket.name}</h3>
                <span className={`text-xs font-medium px-2 py-1 rounded-md inline-block mt-1 ${pocket.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {pocket.type.charAt(0).toUpperCase() + pocket.type.slice(1)} Pocket
                </span>
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => handleEdit(pocket)} className="text-gray-400 hover:text-blue-500 p-1 bg-gray-50 rounded-md"><Edit className="w-4 h-4" /></button>
                 <button onClick={() => handleDelete(pocket._id)} className="text-gray-400 hover:text-red-500 p-1 bg-gray-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="pl-4">
                <p className="text-gray-500 text-sm mb-1">Current Balance</p>
                <p className="text-3xl font-extrabold text-gray-800">${pocket.balance.toFixed(2)}</p>
            </div>
          </div>
        ))}
        {pockets.length === 0 && (
            <div className="col-span-full bg-white p-12 rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                <Wallet className="w-12 h-12 mb-3 text-gray-300" />
                <p>No pockets created yet. Create one to start tracking!</p>
            </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit Pocket' : 'Add New Pocket'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Salary, Side Hustle, Living Expenses"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select 
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              {!editingId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Initial Balance</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={formData.balance}
                      onChange={(e) => setFormData({...formData, balance: Number(e.target.value)})}
                    />
                  </div>
              )}
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 shadow-sm transition-colors">{editingId ? 'Save Changes' : 'Create Pocket'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pockets;
