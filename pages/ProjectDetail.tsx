
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { TaskStatus, UserRole } from '../types';
import { Icons } from '../constants';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, tasks, currentUser, users, addTask, updateTask, updateProject } = useApp();
  
  const project = projects.find(p => p.id === id);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTaskData, setNewTaskData] = useState({ title: '', assignedEditorId: '', value: 0 });

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

  // Budget Logic
  const completedValue = projectTasks
    .filter(t => t.status === TaskStatus.COMPLETED)
    .reduce((sum, t) => sum + t.value, 0);
  
  const completionPercentage = projectTasks.length 
    ? Math.round((projectTasks.filter(t => t.status === TaskStatus.COMPLETED).length / projectTasks.length) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <button onClick={() => navigate(-1)} className="text-xs font-bold text-indigo-600 flex items-center gap-1 mb-2 hover:translate-x-1 transition-transform">
            <svg className="w-3 h-3 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth={2}/></svg>
            BACK TO DASHBOARD
          </button>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{project.name}</h1>
          <p className="text-slate-500">Client: <span className="text-slate-900 dark:text-slate-300 font-medium">{project.clientName}</span></p>
        </div>
        
        <div className="flex gap-3">
          {currentUser?.role === UserRole.ADMIN && (
            <button 
              onClick={() => setIsTaskModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all font-semibold"
            >
              <Icons.Plus className="w-5 h-5" />
              Add Task
            </button>
          )}
          <div className="flex -space-x-3">
            {project.memberIds.map(mid => {
              const u = users.find(user => user.id === mid);
              return <img key={mid} src={u?.avatar} title={u?.name} className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-800 object-cover" />;
            })}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Overall Progress</p>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{completionPercentage}%</p>
            <div className="flex-1 bg-slate-100 dark:bg-slate-700 h-2 rounded-full">
              <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Budget</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">${project.budget.total.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Payment Received</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">${project.budget.received.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Budget Utilization</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">${completedValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex overflow-x-auto gap-6 pb-6 no-scrollbar">
        {columns.map(status => (
          <div key={status} className="flex-shrink-0 w-80">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                {status} 
                <span className="text-xs font-medium bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                  {projectTasks.filter(t => t.status === status).length}
                </span>
              </h3>
            </div>
            
            <div className="space-y-4 min-h-[500px] bg-slate-100/50 dark:bg-slate-800/20 p-3 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
              {projectTasks.filter(t => t.status === status).map(task => (
                <div key={task.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow group relative">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-800 dark:text-white leading-snug">{task.title}</h4>
                    {currentUser?.role !== UserRole.CLIENT && (
                       <div className="hidden group-hover:flex gap-1">
                          {columns.filter(c => c !== status).map(c => (
                            <button 
                              key={c}
                              onClick={() => handleStatusChange(task.id, c)}
                              className="w-5 h-5 bg-slate-100 dark:bg-slate-700 hover:bg-indigo-100 rounded flex items-center justify-center text-[10px] text-slate-600"
                              title={`Move to ${c}`}
                            >
                              {c.charAt(0)}
                            </button>
                          ))}
                       </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">{task.description || 'No description provided.'}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <img 
                        src={users.find(u => u.id === task.assignedEditorId)?.avatar} 
                        className="w-6 h-6 rounded-lg object-cover" 
                      />
                      <span className="text-[10px] font-medium text-slate-400">
                        {users.find(u => u.id === task.assignedEditorId)?.name.split(' ')[0]}
                      </span>
                    </div>
                    {currentUser?.role === UserRole.ADMIN && (
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">${task.value}</span>
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Create New Task</h2>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Task Title</label>
                <input 
                  required
                  type="text" 
                  value={newTaskData.title}
                  onChange={e => setNewTaskData({...newTaskData, title: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 border-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="E.g. Video Editing Batch 1" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assigned Editor</label>
                <select 
                  required
                  value={newTaskData.assignedEditorId}
                  onChange={e => setNewTaskData({...newTaskData, assignedEditorId: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 border-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select an editor</option>
                  {users.filter(u => u.role === UserRole.EDITOR).map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Task Value ($)</label>
                <input 
                  type="number" 
                  value={newTaskData.value}
                  onChange={e => setNewTaskData({...newTaskData, value: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 border-none focus:ring-2 focus:ring-indigo-500" 
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsTaskModalOpen(false)} className="flex-1 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
