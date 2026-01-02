
import React from 'react';
import { useApp } from '../store/AppContext';
import { UserRole, TaskStatus } from '../types';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { currentUser, projects, tasks } = useApp();

  if (!currentUser) return null;

  const relevantProjects = currentUser.role === UserRole.ADMIN 
    ? projects 
    : currentUser.role === UserRole.CLIENT 
      ? projects.filter(p => p.clientId === currentUser.id)
      : projects.filter(p => p.memberIds.includes(currentUser.id));

  const stats = [
    { name: 'Active Projects', value: relevantProjects.length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { name: 'Total Tasks', value: tasks.filter(t => relevantProjects.some(rp => rp.id === t.projectId)).length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Due this week', value: 4, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Hello, {currentUser.name.split(' ')[0]}! 👋</h1>
        <p className="text-slate-500 mt-1">Here is what's happening in Woody today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s) => (
          <div key={s.name} className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
            <p className="text-sm font-medium text-slate-500">{s.name}</p>
            <p className={`text-4xl font-bold mt-2 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project List */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Projects</h2>
            <Link to="/projects" className="text-indigo-600 text-sm font-medium hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {relevantProjects.slice(0, 4).map(project => {
              const projectTasks = tasks.filter(t => t.projectId === project.id);
              const completed = projectTasks.filter(t => t.status === TaskStatus.COMPLETED).length;
              const progress = projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0;
              
              return (
                <Link key={project.id} to={`/projects/${project.id}`} className="block p-4 rounded-2xl border border-slate-50 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors">{project.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">{project.clientName}</p>
                    </div>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full ${
                      project.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                    <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <p className="text-[10px] text-slate-400 font-medium">{progress}% Complete</p>
                    <p className="text-[10px] text-slate-400 font-medium">{completed}/{projectTasks.length} Tasks</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Upcoming Deadlines</h2>
            <span className="bg-orange-50 text-orange-600 text-[10px] uppercase font-bold px-2 py-1 rounded-full">Priority</span>
          </div>
          <div className="space-y-4">
            {tasks
              .filter(t => t.status !== TaskStatus.COMPLETED && relevantProjects.some(rp => rp.id === t.projectId))
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .slice(0, 4)
              .map(task => (
                <div key={task.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-transparent">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex flex-col items-center justify-center text-slate-400 shadow-sm">
                    <span className="text-[10px] font-bold uppercase">{new Date(task.dueDate).toLocaleString('en-US', { month: 'short' })}</span>
                    <span className="text-sm font-bold text-slate-700 dark:text-white">{new Date(task.dueDate).getDate()}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 dark:text-white text-sm">{task.title}</h4>
                    <p className="text-xs text-slate-400">{projects.find(p => p.id === task.projectId)?.name}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    task.status === TaskStatus.IN_PROGRESS ? 'bg-indigo-500' : 'bg-orange-400'
                  }`}></div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
