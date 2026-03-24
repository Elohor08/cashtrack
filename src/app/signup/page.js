"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Wallet } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await signup(name, email, password);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to signup');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white">
        <div className="flex justify-center mb-6">
            <div className="rounded-full bg-emerald-100 p-4 shadow-inner">
                 <Wallet className="w-10 h-10 text-emerald-600" />
            </div>
        </div>
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">Create Account</h2>
        <p className="text-center text-gray-500 mb-8">Start your financial journey today</p>
        
        {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none bg-white/50 focus:bg-white"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none bg-white/50 focus:bg-white"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none bg-white/50 focus:bg-white"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              minLength="6"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-2"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-8 text-center text-gray-600">
          Already have an account? <Link href="/login" className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
