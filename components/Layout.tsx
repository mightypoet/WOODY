
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { Icons } from '../constants';
import { UserRole } from '../types';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!currentUser) return <>{children}</>;

  const menuItems = [
    { name: 'Dashboard', icon: Icons.Dashboard, path: '/' },
    { name: 'Projects', icon: Icons.Tasks, path: '/projects' },
    { name: 'Calendar', icon: Icons.Calendar, path: '/calendar' },
  ];

  if (currentUser.role === UserRole.ADMIN) {
    menuItems.push({ name: 'Financials', icon: Icons.Budget, path: '/financials' });
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col transition-all duration-300 ease-in-out`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 dark:shadow-none">W</div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-white">Woody</span>}
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 p-3 rounded-2xl transition-all
                ${isActive 
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 font-medium' 
                  : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-white'}
              `}
            >
              <item.icon className="w-5 h-5" />
              {isSidebarOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-700">
          <button 
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-3 p-3 w-full rounded-2xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <Icons.Logout className="w-5 h-5" />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 px-8 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="relative group">
              <Icons.Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 w-64 text-sm transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right mr-2 hidden sm:block">
              <p className="text-sm font-semibold text-slate-800 dark:text-white">{currentUser.name}</p>
              <p className="text-xs text-slate-400 capitalize">{currentUser.role.toLowerCase()}</p>
            </div>
            <img src={currentUser.avatar} alt="User" className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-50 dark:ring-slate-700 shadow-sm" />
          </div>
        </header>

        {/* Page Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
