"use client";
import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [pockets, setPockets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Generic DB reader
  const readDB = (key) => JSON.parse(localStorage.getItem(key) || '[]');
  // Generic DB writer
  const writeDB = (key, data) => localStorage.setItem(key, JSON.stringify(data));

  const generateAlerts = useCallback((tList, bList) => {
      const quotes = [
        "A penny saved is a penny earned.",
        "Wealth consists not in having great possessions, but in having few wants.",
        "The quickest way to double your money is to fold it over and put it back in your pocket."
      ];
      const newAlerts = [];
      newAlerts.push({ type: 'quote', message: quotes[Math.floor(Math.random() * quotes.length)] });

      const currentMonth = new Date().toISOString().slice(0, 7);
      const activeBudgets = bList.filter(b => b.month === currentMonth);
      
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

      const currentTransactions = tList.filter(t => t.type === 'expense' && new Date(t.date) >= startOfMonth && new Date(t.date) <= endOfMonth);

      const categorySpends = {};
      currentTransactions.forEach(t => {
          categorySpends[t.category] = (categorySpends[t.category] || 0) + Number(t.amount);
      });

      activeBudgets.forEach(b => {
          const spent = categorySpends[b.category] || 0;
          if (spent > b.amount) {
              newAlerts.push({ type: 'error', message: `You have exceeded your budget for ${b.category}!` });
          } else if (spent > b.amount * 0.8) {
              newAlerts.push({ type: 'warning', message: `You've used ${((spent/b.amount)*100).toFixed(0)}% of your ${b.category} budget.` });
          } else {
              newAlerts.push({ type: 'success', message: `Great job keeping ${b.category} expenses low!` });
          }
      });
      setAlerts(newAlerts);
  }, []);

  const fetchData = useCallback(() => {
    if (!user) return;
    const allPockets = readDB('cashtrack_pockets').filter(p => p.userId === user.id).sort((a,b) => b.createdAt - a.createdAt);
    const allTransactions = readDB('cashtrack_transactions').filter(t => t.userId === user.id).sort((a,b) => new Date(b.date) - new Date(a.date));
    const allBudgets = readDB('cashtrack_budgets').filter(b => b.userId === user.id).sort((a,b) => b.month.localeCompare(a.month) * -1);

    setPockets(allPockets);
    setTransactions(allTransactions);
    setBudgets(allBudgets);
    generateAlerts(allTransactions, allBudgets);
  }, [user, generateAlerts]);

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setPockets([]);
      setTransactions([]);
      setBudgets([]);
        setAlerts([]);
    }
  }, [user, fetchData]);

  // Actions
  const addPocket = async (data) => {
    const all = readDB('cashtrack_pockets');
    const newPocket = { _id: Date.now().toString(), userId: user.id, createdAt: Date.now(), ...data };
    all.push(newPocket);
    writeDB('cashtrack_pockets', all);
    fetchData();
    return newPocket;
  };

  const updatePocket = async (id, data) => {
    const all = readDB('cashtrack_pockets');
    const index = all.findIndex(p => p._id === id);
    if (index !== -1) {
        all[index] = { ...all[index], ...data };
        writeDB('cashtrack_pockets', all);
        fetchData();
    }
  };

  const deletePocket = async (id) => {
    const allPockets = readDB('cashtrack_pockets').filter(p => p._id !== id);
    writeDB('cashtrack_pockets', allPockets);
    const allTrans = readDB('cashtrack_transactions').filter(t => t.pocketId !== id);
    writeDB('cashtrack_transactions', allTrans);
    fetchData();
  };

  const addTransaction = async (data) => {
    const allT = readDB('cashtrack_transactions');
    const newT = { _id: Date.now().toString(), userId: user.id, createdAt: Date.now(), date: data.date || new Date().toISOString(), ...data };
    allT.push(newT);
    writeDB('cashtrack_transactions', allT);

    const allP = readDB('cashtrack_pockets');
    const pIdx = allP.findIndex(p => p._id === data.pocketId);
    if (pIdx !== -1) {
        if (data.type === 'income') allP[pIdx].balance += Number(data.amount);
        else allP[pIdx].balance -= Number(data.amount);
        writeDB('cashtrack_pockets', allP);
    }
    fetchData();
  };

  const deleteTransaction = async (id) => {
    const allT = readDB('cashtrack_transactions');
    const t = allT.find(t => t._id === id);
    if (t) {
        const filteredT = allT.filter(t => t._id !== id);
        writeDB('cashtrack_transactions', filteredT);

        const allP = readDB('cashtrack_pockets');
        const pIdx = allP.findIndex(p => p._id === t.pocketId);
        if (pIdx !== -1) {
            if (t.type === 'income') allP[pIdx].balance -= Number(t.amount);
            else allP[pIdx].balance += Number(t.amount);
            writeDB('cashtrack_pockets', allP);
        }
        fetchData();
    }
  };

  const addBudget = async (data) => {
    const all = readDB('cashtrack_budgets');
    const newB = { _id: Date.now().toString(), userId: user.id, createdAt: Date.now(), ...data };
    all.push(newB);
    writeDB('cashtrack_budgets', all);
    fetchData();
  };

  const deleteBudget = async (id) => {
    const all = readDB('cashtrack_budgets').filter(b => b._id !== id);
    writeDB('cashtrack_budgets', all);
    fetchData();
  };

  const getInsights = async () => {
    const currentTransactions = transactions.slice(0, 50);
    let income = 0; let expense = 0;
    const expenseCategories = {};
    currentTransactions.forEach(t => {
      if (t.type === 'income') income += Number(t.amount);
      else {
        expense += Number(t.amount);
        expenseCategories[t.category] = (expenseCategories[t.category] || 0) + Number(t.amount);
      }
    });

    const categories = Object.entries(expenseCategories).sort((a,b) => b[1]-a[1]);
    const topCat = categories.length > 0 ? categories[0][0] : 'anything';
    return { advice: `Your top expense lately is ${topCat}. Try reducing spending there by 10% this week. Keep actively saving your $${income} in income!` };
  };

  return (
    <DataContext.Provider value={{ 
        pockets, transactions, budgets, alerts, fetchData,
        addPocket, updatePocket, deletePocket,
        addTransaction, deleteTransaction,
        addBudget, deleteBudget, getInsights
    }}>
      {children}
    </DataContext.Provider>
  );
};
