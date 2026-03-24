"use client";
import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [pockets, setPockets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
        setPockets([]);
        setTransactions([]);
        setBudgets([]);
        setAlerts([]);
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [pRes, tRes, bRes, aRes] = await Promise.all([
        axios.get('/api/pockets'),
        axios.get('/api/transactions'),
        axios.get('/api/budgets'),
        axios.get('/api/alerts')
      ]);
      setPockets(pRes.data);
      setTransactions(tRes.data);
      setBudgets(bRes.data);
      setAlerts(aRes.data);
    } catch (error) {
      console.error("Error fetching initial data", error);
    }
  };

  return (
    <DataContext.Provider value={{ pockets, transactions, budgets, alerts, fetchData }}>
      {children}
    </DataContext.Provider>
  );
};
