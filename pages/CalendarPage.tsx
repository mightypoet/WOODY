
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { UserRole } from '../types';
import { Icons } from '../constants';

export const CalendarPage: React.FC = () => {
  const { contentPosts, projects, users, currentUser, addContentPost } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ date: '', projectId: '', platform: 'Instagram' as any });

  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const days = Array.from({ length: 42 }, (_, i) => {
    const day = i - startDay + 1;
    if (day > 0 && day <= totalDays) return day;
    return null;
  });

  const getPostsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return contentPosts.filter(p => p.date === dateStr);
  };

  const platformColors: Record<string, string> = {
    'Instagram': 'bg-pink-100 text-pink-700 border-pink-200',
    'TikTok': 'bg-black text-white border-black',
    'YouTube': 'bg-red-100 text-red-700 border-red-200',
    'X': 'bg-slate-900 text-white border-slate-900',
    'LinkedIn': 'bg-blue-100 text-blue-700 border-blue-200',
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Content Calendar</h1>
          <p className="text-slate-500">Manage and schedule content across platforms.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-1 shadow-sm">
            <button 
              onClick={() => setCurrentDate(new Date(year, month - 1))}
              className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all"
            >
              <svg className="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth={2}/></svg>
            </button>
            <div className="px-6 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </div>
            <button 
              onClick={() => setCurrentDate(new Date(year, month + 1))}
              className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth={2}/></svg>
            </button>
          </div>
          {currentUser?.role === UserRole.ADMIN && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl shadow-lg transition-all font-semibold flex items-center gap-2"
            >
              <Icons.Plus className="w-5 h-5" />
              Schedule Post
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="p-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">{d}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7">
          {days.map((day, i) => (
            <div key={i} className={`min-h-[140px] border-r border-b border-slate-100 dark:border-slate-700 p-2 transition-colors ${!day ? 'bg-slate-50/50 dark:bg-slate-900/20' : 'hover:bg-slate-50/80 dark:hover:bg-slate-700/20'}`}>
              {day && (
                <>
                  <div className="text-sm font-semibold text-slate-400 mb-2 px-1">{day}</div>
                  <div className="space-y-1">
                    {getPostsForDay(day).map(post => (
                      <div key={post.id} className={`text-[10px] p-1.5 rounded-lg border flex items-center gap-1 font-medium transition-transform hover:scale-[1.02] cursor-pointer shadow-sm ${platformColors[post.platform] || 'bg-slate-100'}`}>
                        <div className="w-1 h-1 rounded-full bg-current"></div>
                        <span className="truncate">{projects.find(p => p.id === post.projectId)?.name}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Schedule Content Post</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              addContentPost({ ...newPost, editorId: currentUser?.id, status: 'Scheduled' });
              setIsModalOpen(false);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project</label>
                <select 
                  required
                  value={newPost.projectId}
                  onChange={e => setNewPost({...newPost, projectId: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 border-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-white"
                >
                  <option value="">Select Project</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                <input 
                  required
                  type="date" 
                  value={newPost.date}
                  onChange={e => setNewPost({...newPost, date: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 border-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Platform</label>
                <select 
                  value={newPost.platform}
                  onChange={e => setNewPost({...newPost, platform: e.target.value as any})}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 border-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-white"
                >
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="YouTube">YouTube</option>
                  <option value="X">X (Twitter)</option>
                  <option value="LinkedIn">LinkedIn</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg transition-all">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
