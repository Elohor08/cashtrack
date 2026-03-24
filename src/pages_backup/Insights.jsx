import { useState } from 'react';
import { useData } from '../context/DataContext';
import axios from 'axios';
import { Lightbulb, Sparkles, Quote, Loader2, ArrowRight } from 'lucide-react';

const Insights = () => {
  const { alerts } = useData();
  const [aiAdvice, setAiAdvice] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  const quoteAlert = alerts.find(a => a.type === 'quote');
  const habitAlerts = alerts.filter(a => a.type !== 'quote');

  const fetchAiAdvice = async () => {
    setLoadingAi(true);
    try {
      const res = await axios.get('/api/ai-insights');
      setAiAdvice(res.data.advice);
    } catch (err) {
      console.error(err);
      setAiAdvice("Unable to fetch AI insights at this moment.");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Financial Insights</h2>
      </div>

      {quoteAlert && (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
             <Quote className="absolute -top-4 -right-4 w-32 h-32 opacity-10 transform rotate-12" />
             <div className="relative z-10 flex flex-col items-center text-center">
                <p className="text-2xl md:text-3xl font-serif italic font-medium leading-relaxed mb-4">"{quoteAlert.message}"</p>
                <div className="w-16 h-1 bg-white/30 rounded-full"></div>
             </div>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Habit Checks */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
           <div className="flex items-center space-x-3 mb-6 border-b border-gray-100 pb-4">
               <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                   <Lightbulb className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold text-gray-800">Habit Check</h3>
           </div>
           
           {habitAlerts.length > 0 ? (
               <div className="space-y-4">
                   {habitAlerts.map((alert, idx) => (
                       <div key={idx} className={`p-4 rounded-xl flex items-start space-x-3 border ${alert.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' : alert.type === 'warning' ? 'bg-yellow-50 border-yellow-100 text-yellow-700' : alert.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
                          <ArrowRight className={`w-5 h-5 flex-shrink-0 mt-0.5 ${alert.type === 'error' ? 'text-red-500' : alert.type === 'warning' ? 'text-yellow-500' : alert.type === 'success' ? 'text-emerald-500' : 'text-blue-500'}`} />
                          <p className="font-medium">{alert.message}</p>
                       </div>
                   ))}
               </div>
           ) : (
               <p className="text-gray-500 font-medium">Create budgets to start receiving personalized habit checks!</p>
           )}
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 relative overflow-hidden group hover:shadow-md transition-shadow flex flex-col">
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
           <div className="flex items-center space-x-3 mb-6 border-b border-gray-100 pb-4">
               <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
                   <Sparkles className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold text-gray-800">AI Financial Advisor</h3>
           </div>
           
           <div className="mb-6 flex-1">
                <p className="text-gray-600 font-medium leading-relaxed">Get personalized, AI-driven advice based on your recent spending habits and income streams.</p>
           </div>

           {aiAdvice && (
               <div className="bg-purple-50 border border-purple-100 rounded-xl p-5 mb-6 text-purple-800 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-2">
                   {aiAdvice}
               </div>
           )}

           <button 
                onClick={fetchAiAdvice}
                disabled={loadingAi}
                className="w-full mt-auto bg-gray-900 hover:bg-black text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
            >
                {loadingAi ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                <span>{loadingAi ? 'Analyzing your data...' : 'Generate AI Advice'}</span>
           </button>
        </div>
      </div>
    </div>
  );
}

export default Insights;
