
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { UserRole } from '../types';
import { Icons } from '../constants';

export const CalendarPage: React.FC = () => {
  const { contentPosts, projects, currentUser, addContentPost, deleteContentPost, updateContentPost } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', date: '', projectId: '', platform: 'Instagram' as any });

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  // Role Filtering
  const filteredPosts = contentPosts.filter(post => {
    if (currentUser?.role === UserRole.ADMIN) return true;
    const project = projects.find(p => p.id === post.projectId);
    if (currentUser?.role === UserRole.CLIENT) return project?.clientId === currentUser.id;
    if (currentUser?.role === UserRole.EDITOR) return project?.memberIds.includes(currentUser.id);
    return false;
  });

  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);
  const days = Array.from({ length: 42 }, (_, i) => {
    const day = i - startDay + 1;
    return (day > 0 && day <= totalDays) ? day : null;
  });

  const getPostsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredPosts.filter(p => p.date === dateStr);
  };

  const platformColors: Record<string, string> = {
    'Instagram': 'bg-pink-50 text-pink-600 border-pink-100',
    'TikTok': 'bg-slate-50 text-slate-800 border-slate-200',
    'YouTube': 'bg-red-50 text-red-600 border-red-100',
    'LinkedIn': 'bg-blue-50 text-blue-600 border-blue-100',
    'X': 'bg-slate-900 text-white border-slate-900',
  };

  const handleDayClick = (day: number) => {
    if (currentUser?.role !== UserRole.ADMIN) return;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setFormData({ title: '', date: dateStr, projectId: projects[0]?.id || '', platform: 'Instagram' });
    setSelectedPost(null);
    setIsModalOpen(true);
  };

  const handlePostClick = (e: React.MouseEvent, post: any) => {
    e.stopPropagation();
    if (currentUser?.role !== UserRole.ADMIN) return;
    setSelectedPost(post);
    setFormData({ title: post.title || '', date: post.date, projectId: post.projectId, platform: post.platform });
    setIsModalOpen(true);
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Content Calendar</h1>
          <p className="text-slate-400 mt-1">
            {currentUser?.role === UserRole.CLIENT 
              ? `Viewing scheduled content for your projects.` 
              : `Review and schedule publishing for all clients.`}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-50 border border-slate-100 rounded-xl p-1">
            <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-400">
              <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth={2}/></svg>
            </button>
            <div className="px-6 flex items-center justify-center font-bold text-slate-800 text-sm">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </div>
            <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth={2}/></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-100">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-6 text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">{d}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7">
          {days.map((day, i) => (
            <div 
              key={i} 
              onClick={() => day && handleDayClick(day)}
              className={`min-h-[160px] border-r border-b border-slate-50 p-3 transition-all ${day ? 'hover:bg-slate-50/50 cursor-pointer' : 'bg-slate-50/20'}`}
            >
              {day && (
                <>
                  <div className="text-sm font-bold text-slate-400 mb-3 px-1">{day}</div>
                  <div className="space-y-2">
                    {getPostsForDay(day).map(post => (
                      <div 
                        key={post.id} 
                        onClick={(e) => handlePostClick(e, post)}
                        className={`text-[10px] p-2 rounded-xl border flex flex-col gap-1 font-bold transition-all hover:translate-y-[-2px] hover:shadow-md ${platformColors[post.platform]}`}
                      >
                        <span className="opacity-70 uppercase text-[8px]">{post.platform}</span>
                        <span className="truncate">{post.title || projects.find(p => p.id === post.projectId)?.name}</span>
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
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 border border-slate-100 shadow-2xl">
            <h2 className="text-2xl font-bold mb-8 text-slate-900">{selectedPost ? 'Edit' : 'Schedule'} Content</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (selectedPost) {
                updateContentPost(selectedPost.id, { ...formData });
              } else {
                addContentPost({ ...formData, editorId: currentUser?.id });
              }
              setIsModalOpen(false);
            }} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-black transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Date</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Platform</label>
                  <select value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value as any})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none">
                    <option>Instagram</option><option>TikTok</option><option>YouTube</option><option>LinkedIn</option><option>X</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project</label>
                <select value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none">
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-400 font-bold">Close</button>
                {selectedPost && (
                  <button type="button" onClick={() => { deleteContentPost(selectedPost.id); setIsModalOpen(false); }} className="flex-1 py-4 text-red-500 font-bold border border-red-50 rounded-2xl">Delete</button>
                )}
                <button type="submit" className="flex-1 py-4 bg-black text-white font-bold rounded-2xl shadow-xl shadow-slate-200">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
