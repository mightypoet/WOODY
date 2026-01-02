
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
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <aside className={`transition-layout ${isSidebarOpen ? 'w-72' : 'w-24'} bg-slate-50 border-r border-slate-100 flex flex-col`}>
        <div className="p-10 flex items-center gap-4">
          <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0">W</div>
          {isSidebarOpen && <span className="font-display font-extrabold text-xl tracking-tight text-slate-900">Woody</span>}
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-4 p-4 rounded-2xl transition-all group
                ${isActive 
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-100 font-bold' 
                  : 'text-slate-400 hover:text-slate-900 hover:bg-white/50'}
              `}
            >
              <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {isSidebarOpen && <span className="text-sm tracking-tight">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-8">
          <div className={`p-4 rounded-3xl bg-white border border-slate-100 ${!isSidebarOpen && 'flex justify-center'}`}>
            <div className={`flex items-center gap-3 ${!isSidebarOpen && 'hidden'}`}>
              <img src={currentUser.avatar} className="w-10 h-10 rounded-full border border-slate-50" />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{currentUser.role}</p>
              </div>
            </div>
            <button 
              onClick={() => { logout(); navigate('/login'); }}
              className={`mt-4 w-full flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:text-red-500 transition-all text-xs font-bold uppercase tracking-widest ${!isSidebarOpen && 'justify-center p-2 mt-0'}`}
            >
              <Icons.Logout className="w-4 h-4" />
              {isSidebarOpen && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        <header className="h-24 px-12 flex items-center justify-between border-b border-slate-50">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-50 rounded-full text-slate-300">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 8h16M4 16h16" strokeWidth={2.5} strokeLinecap="round"/></svg>
          </button>
          <div className="flex items-center gap-4 text-slate-300">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-12 py-8 no-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};
