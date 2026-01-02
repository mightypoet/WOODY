
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
    { name: 'Overview', icon: Icons.Dashboard, path: '/' },
    { name: 'Projects', icon: Icons.Tasks, path: '/projects' },
    { name: 'Calendar', icon: Icons.Calendar, path: '/calendar' },
  ];

  if (currentUser.role === UserRole.ADMIN) {
    menuItems.push({ name: 'Accounts', icon: Icons.Search, path: '/admin/accounts' });
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden transition-colors">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-50 border-r border-slate-100 flex flex-col transition-all duration-300 ease-in-out`}>
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg">W</div>
          {isSidebarOpen && <span className="font-bold text-lg tracking-tight text-slate-900">Woody</span>}
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 p-3 rounded-xl transition-all
                ${isActive 
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-100 font-semibold' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}
              `}
            >
              <item.icon className="w-5 h-5" />
              {isSidebarOpen && <span className="text-sm">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-3 p-3 w-full rounded-xl text-slate-400 hover:text-red-500 transition-all text-sm"
          >
            <Icons.Logout className="w-5 h-5" />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-100 px-10 flex items-center justify-between z-10">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h2 className="text-slate-400 font-medium text-sm">Woody / <span className="text-slate-900 capitalize">{window.location.hash.split('/').pop() || 'Dashboard'}</span></h2>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right mr-2">
              <p className="text-sm font-bold text-slate-900">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{currentUser.role}</p>
            </div>
            <img src={currentUser.avatar} alt="User" className="w-10 h-10 rounded-full border border-slate-200 object-cover" />
          </div>
        </header>

        {/* Page Area */}
        <div className="flex-1 overflow-y-auto p-10 bg-white">
          {children}
        </div>
      </main>
    </div>
  );
};
