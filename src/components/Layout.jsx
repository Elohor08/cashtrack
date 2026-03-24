"use client";
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Home, Wallet, Receipt, PieChart, Lightbulb, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Layout = ({ children }) => {
  const { logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Pockets', path: '/pockets', icon: Wallet },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'Budgets', path: '/budgets', icon: PieChart },
    { name: 'Insights', path: '/insights', icon: Lightbulb },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm z-10 w-64 flex-shrink-0 fixed md:static h-full">
        <div className="p-6 flex items-center justify-center border-b border-gray-100">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent transform transition-all hover:scale-105 cursor-pointer">CashTrack</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-600 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-500'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-500'}`} />
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="text-sm font-medium text-gray-700 truncate">{user?.name}</div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-xl text-red-600 hover:bg-red-50 transition-colors group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header component */}
      <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">CashTrack</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-10 bg-white pt-16 flex flex-col shadow-xl animate-in slide-in-from-top">
          <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
             {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl ${
                      isActive ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-xl text-red-600 hover:bg-red-50 mt-4"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full p-4 md:p-8 bg-gray-50/50">
        <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
           {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
