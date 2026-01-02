
import React from 'react';
import { useApp } from '../store/AppContext';
import { UserRole, TaskStatus } from '../types';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { currentUser, projects, tasks } = useApp();

  if (!currentUser) return null;

  const relevantProjects = currentUser.role === UserRole.ADMIN 
    ? projects 
    : projects.filter(p => p.memberIds.includes(currentUser.id) || p.clientId === currentUser.id);

  const activeTasks = tasks.filter(t => 
    relevantProjects.some(rp => rp.id === t.projectId) && t.status !== TaskStatus.COMPLETED
  );

  const stats = [
    { label: 'Active Projects', value: relevantProjects.length, color: 'text-blue-600' },
    { label: 'Pending Tasks', value: activeTasks.length, color: 'text-amber-600' },
    { label: 'Upcoming Deadlines', value: tasks.filter(t => new Date(t.dueDate) > new Date()).length, color: 'text-indigo-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 animate-in fade-in duration-500">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Good day, {currentUser.name.split(' ')[0]}</h1>
        <p className="text-slate-500 mt-2 font-medium">Woody overview for today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
            <p className={`text-5xl font-extrabold mt-3 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-slate-800">Your Projects</h2>
            <Link to="/projects" className="text-sm font-bold text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relevantProjects.slice(0, 4).map(p => {
              const pTasks = tasks.filter(t => t.projectId === p.id);
              const progress = pTasks.length ? Math.round((pTasks.filter(t => t.status === TaskStatus.COMPLETED).length / pTasks.length) * 100) : 0;
              return (
                <Link key={p.id} to={`/projects/${p.id}`} className="group bg-slate-50 border border-slate-100 p-6 rounded-[28px] hover:bg-white hover:border-blue-100 hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.clientName}</span>
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{p.name}</h3>
                  <div className="mt-6">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2 uppercase">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800">Next Actions</h2>
          <div className="space-y-3">
            {activeTasks.slice(0, 5).map(t => (
              <div key={t.id} className="p-5 border border-slate-100 rounded-2xl flex items-center justify-between group hover:bg-slate-50 transition-colors cursor-pointer">
                <div>
                  <p className="font-semibold text-sm text-slate-900">{t.title}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{t.dueDate}</p>
                </div>
                <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-white group-hover:border-blue-500 transition-all">
                  <svg className="w-3 h-3 text-slate-300 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
