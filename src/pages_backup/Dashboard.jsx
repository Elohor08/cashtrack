import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Wallet, TrendingUp, TrendingDown, Bell } from 'lucide-react';

const Dashboard = () => {
  const { pockets, transactions, alerts } = useData();
  const { user } = useAuth();

  // Calculations
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const totalBalance = pockets.reduce((acc, p) => acc + p.balance, 0);

  // Expense by category chart data
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
    }, {});
    
  const pieData = Object.keys(expenseByCategory).map(key => ({
      name: key,
      value: expenseByCategory[key]
  }));

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Hello, {user?.name}! 👋</h2>
      </div>

      {alerts.length > 0 && (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {alerts.slice(0, 2).map((alert, idx) => (
                <div key={idx} className={`p-4 rounded-xl flex items-start space-x-3 shadow-sm border ${alert.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' : alert.type === 'warning' ? 'bg-yellow-50 border-yellow-100 text-yellow-700' : alert.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
                    <Bell className={`w-5 h-5 flex-shrink-0 mt-0.5 ${alert.type === 'error' ? 'text-red-500' : alert.type === 'warning' ? 'text-yellow-500' : alert.type === 'success' ? 'text-emerald-500' : 'text-blue-500'}`} />
                    <p className="text-sm font-medium">{alert.message}</p>
                </div>
             ))}
         </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <Wallet className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Balance</p>
            <h3 className="text-2xl font-bold text-gray-800">${totalBalance.toFixed(2)}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
             <p className="text-sm text-gray-500 font-medium">Total Income</p>
            <h3 className="text-2xl font-bold text-gray-800">${totalIncome.toFixed(2)}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl">
            <TrendingDown className="w-8 h-8" />
          </div>
          <div>
             <p className="text-sm text-gray-500 font-medium">Total Expense</p>
            <h3 className="text-2xl font-bold text-gray-800">${totalExpense.toFixed(2)}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Expense Breakdown</h3>
          {pieData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
             <div className="h-64 flex items-center justify-center text-gray-400">
                 No expenses logged yet.
             </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
          </div>
          {transactions.length > 0 ? (
               <div className="space-y-4">
               {transactions.slice(0, 5).map(t => (
                 <div key={t._id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                   <div className="flex items-center space-x-3">
                     <div className={`p-2 rounded-lg ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                         {t.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5"/>}
                     </div>
                     <div>
                       <p className="font-semibold text-gray-800">{t.category}</p>
                       <p className="text-xs text-gray-500">{new Date(t.date).toLocaleDateString()}</p>
                     </div>
                   </div>
                   <span className={`font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-gray-800'}`}>
                     {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                   </span>
                 </div>
               ))}
             </div>
          ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                 No transactions logged yet.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
