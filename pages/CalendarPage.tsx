
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { UserRole } from '../types';
import { Icons } from '../constants';

export const CalendarPage: React.FC = () => {
  const { contentPosts, projects, currentUser, addContentPost, deleteContentPost, updateContentPost } = useApp();
  const [viewDate, setViewDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: '', date: '', projectId: '', platform: 'Instagram' as any });

  const month = viewDate.getMonth();
  const year = viewDate.getFullYear();

  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();
  const totalDays = daysInMonth(year, month);
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const day = i - startDay + 1;
    return (day > 0 && day <= totalDays) ? day : null;
  });

  const relevantPosts = contentPosts.filter(p => {
    const project = projects.find(pr => pr.id === p.projectId);
    if (currentUser?.role === UserRole.ADMIN) return true;
    if (currentUser?.role === UserRole.CLIENT) return project?.clientId === currentUser.id;
    return project?.memberIds.includes(currentUser?.id || '');
  });

  const getPostsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return relevantPosts.filter(p => p.date === dateStr);
  };

  const handleDayClick = (day: number) => {
    if (currentUser?.role === UserRole.ADMIN) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      setModalData({ title: '', date: dateStr, projectId: projects[0]?.id || '', platform: 'Instagram' });
      setIsModalOpen(true);
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      <header className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Content Calendar</h1>
          <p className="text-slate-400 font-medium mt-1">Multi-platform scheduling for {currentUser?.role === UserRole.CLIENT ? 'your brand' : 'all clients'}.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-50 border border-slate-100 rounded-2xl p-1">
            <button onClick={() => setViewDate(new Date(year, month - 1))} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all"><Icons.Search className="w-4 h-4 rotate-180 text-slate-400" /></button>
            <div className="px-6 flex items-center justify-center font-bold text-slate-800 text-sm">{viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
            <button onClick={() => setViewDate(new Date(year, month + 1))} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all"><Icons.Search className="w-4 h-4 text-slate-400" /></button>
          </div>
          {currentUser?.role === UserRole.ADMIN && (
             <button onClick={() => { setModalData({...modalData, date: new Date().toISOString().split('T')[0]}); setIsModalOpen(true); }} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-blue-100 flex items-center gap-2">
               <Icons.Plus className="w-4 h-4" /> Schedule
             </button>
          )}
        </div>
      </header>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-100">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-6 text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">{d}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7">
          {calendarDays.map((day, i) => (
            <div key={i} onClick={() => day && handleDayClick(day)} className={`min-h-[160px] border-r border-b border-slate-50 p-4 transition-all ${day ? 'hover:bg-slate-50/50 cursor-pointer' : 'bg-slate-50/20'}`}>
              {day && (
                <>
                  <div className="text-xs font-bold text-slate-400 mb-3">{day}</div>
                  <div className="space-y-1.5">
                    {getPostsForDay(day).map(post => (
                      <div key={post.id} className="text-[10px] p-2 rounded-xl bg-white border border-slate-100 shadow-sm flex flex-col font-bold truncate">
                        <span className={`uppercase text-[8px] mb-0.5 ${post.platform === 'Instagram' ? 'text-pink-500' : 'text-blue-500'}`}>{post.platform}</span>
                        <span className="text-slate-800 truncate">{post.title}</span>
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
        <div className="fixed inset-0 bg-white/60 backdrop-blur-xl z-[60] flex items-center justify-center p-6 animate-in zoom-in-95 duration-200">
          <div className="bg-white w-full max-w-md rounded-[40px] border border-slate-100 shadow-2xl p-10">
            <h2 className="text-2xl font-extrabold mb-8 text-slate-900 tracking-tight">Schedule Post</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              addContentPost({ ...modalData, editorId: currentUser?.id });
              setIsModalOpen(false);
            }} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Post Title</label>
                <input required type="text" value={modalData.title} onChange={e => setModalData({...modalData, title: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Date</label>
                  <input required type="date" value={modalData.date} onChange={e => setModalData({...modalData, date: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Platform</label>
                  <select value={modalData.platform} onChange={e => setModalData({...modalData, platform: e.target.value as any})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none">
                    <option>Instagram</option><option>YouTube</option><option>LinkedIn</option><option>TikTok</option><option>X</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Linked Project</label>
                <select required value={modalData.projectId} onChange={e => setModalData({...modalData, projectId: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none">
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Close</button>
                <button type="submit" className="flex-1 py-4 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-xs">Save Post</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
