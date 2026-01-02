
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { TaskStatus, UserRole } from '../types';
import { Icons } from '../constants';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, tasks, currentUser, users, addTask, updateTask, deleteContentPost } = useApp();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTaskData, setNewTaskData] = useState({ title: '', assignedEditorId: '', value: 0 });

  const project = projects.find(p => p.id === id);
  if (!project) return <div>Project not found</div>;

  const projectTasks = tasks.filter(t => t.projectId === id);
  const columns = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.REVIEW, TaskStatus.COMPLETED];

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({ ...newTaskData, projectId: project.id, status: TaskStatus.TODO });
    setIsTaskModalOpen(false);
    setNewTaskData({ title: '', assignedEditorId: '', value: 0 });
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  const completedValue = projectTasks.filter(t => t.status === TaskStatus.COMPLETED).reduce((sum, t) => sum + t.value, 0);
  const budgetUtilization = Math.round((completedValue / project.budget.total) * 100) || 0;

  return (
    <div className="max-w-7xl mx-auto py-4 space-y-10 animate-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <button onClick={() => navigate(-1)} className="text-[10px] font-bold text-blue-600 mb-4 flex items-center gap-1 uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
            <svg className="w-3 h-3 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth={3}/></svg>
            Projects
          </button>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{project.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{project.clientName}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">{project.status}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {project.memberIds.map(mid => (
              <img key={mid} src={users.find(u => u.id === mid)?.avatar} className="w-10 h-10 rounded-full border-4 border-white shadow-sm hover:z-10 transition-all cursor-pointer" />
            ))}
          </div>
          {currentUser?.role === UserRole.ADMIN && (
            <button onClick={() => setIsTaskModalOpen(true)} className="bg-black text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2">
              <Icons.Plus className="w-4 h-4" /> Add Task
            </button>
          )}
        </div>
      </div>

      {/* Financials & Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Budget Utilization</p>
          <div className="flex items-end justify-between">
            <p className="text-4xl font-extrabold text-slate-900">{budgetUtilization}%</p>
            <p className="text-xs font-bold text-slate-400 pb-1">${completedValue.toLocaleString()} / ${project.budget.total.toLocaleString()}</p>
          </div>
          <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${budgetUtilization}%` }}></div>
          </div>
        </div>
        
        <div className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Financial Status</p>
          <p className="text-2xl font-bold text-emerald-600">${project.budget.received.toLocaleString()} Received</p>
          <p className="text-sm font-medium text-slate-400 mt-1">${(project.budget.total - project.budget.received).toLocaleString()} Remaining</p>
        </div>

        <div className="bg-slate-50 border border-slate-100 p-8 rounded-[32px] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timeline</p>
            <p className="text-sm font-bold text-slate-900 mt-2">{new Date(project.timeline.start).toLocaleDateString()} — {new Date(project.timeline.end).toLocaleDateString()}</p>
          </div>
          <Icons.Calendar className="w-8 h-8 text-slate-200" />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-8 overflow-x-auto pb-10 no-scrollbar items-start">
        {columns.map(status => (
          <div key={status} className="w-80 shrink-0">
            <div className="flex items-center justify-between px-2 mb-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">{status}</h3>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg">{projectTasks.filter(t => t.status === status).length}</span>
            </div>
            
            <div className="space-y-4 kanban-column p-2 bg-slate-50/50 rounded-[32px] border border-dashed border-slate-200">
              {projectTasks.filter(t => t.status === status).map(task => (
                <div key={task.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group cursor-grab active:cursor-grabbing">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{task.title}</h4>
                    {currentUser?.role !== UserRole.CLIENT && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {columns.filter(c => c !== status).map(c => (
                          <button key={c} onClick={() => handleStatusChange(task.id, c)} className="w-4 h-4 rounded-full bg-slate-100 text-[8px] font-bold text-slate-400 flex items-center justify-center hover:bg-blue-600 hover:text-white" title={c}>{c[0]}</button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mb-6 leading-relaxed line-clamp-2">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={users.find(u => u.id === task.assignedEditorId)?.avatar} className="w-6 h-6 rounded-full" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{users.find(u => u.id === task.assignedEditorId)?.name.split(' ')[0]}</span>
                    </div>
                    {currentUser?.role === UserRole.ADMIN && (
                      <span className="text-[10px] font-bold text-emerald-600">${task.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-xl z-[60] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[40px] border border-slate-100 shadow-2xl p-10">
            <h2 className="text-2xl font-extrabold mb-8 text-slate-900">New Task</h2>
            <form onSubmit={handleAddTask} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Title</label>
                <input required type="text" value={newTaskData.title} onChange={e => setNewTaskData({...newTaskData, title: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Assigned To</label>
                  <select required value={newTaskData.assignedEditorId} onChange={e => setNewTaskData({...newTaskData, assignedEditorId: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none">
                    <option value="">Select...</option>
                    {users.filter(u => u.role === UserRole.EDITOR).map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Value ($)</label>
                  <input type="number" value={newTaskData.value} onChange={e => setNewTaskData({...newTaskData, value: parseInt(e.target.value)})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none" />
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsTaskModalOpen(false)} className="flex-1 py-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-slate-200">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
