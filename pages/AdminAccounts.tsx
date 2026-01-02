
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { UserRole } from '../types';

export const AdminAccounts: React.FC = () => {
  const { users, projects, updateUser, currentUser } = useApp();
  const [editingUser, setEditingUser] = useState<any>(null);

  if (currentUser?.role !== UserRole.ADMIN) return <div className="p-10 text-center font-bold text-red-500">ACCESS DENIED</div>;

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    updateUser(id, { active: !currentStatus });
  };

  const handleChangeRole = (id: string, role: UserRole) => {
    updateUser(id, { role });
  };

  const handleAssignProject = (userId: string, projectId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const exists = user.assignedProjects.includes(projectId);
    const updated = exists 
      ? user.assignedProjects.filter(pid => pid !== projectId)
      : [...user.assignedProjects, projectId];
    updateUser(userId, { assignedProjects: updated });
  };

  return (
    <div className="animate-in slide-in-from-bottom-6 duration-700">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Account Management</h1>
        <p className="text-slate-400 mt-1">Manage user roles, project access, and account statuses.</p>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/30">
              <th className="p-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest">User</th>
              <th className="p-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest">Role</th>
              <th className="p-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest">Status</th>
              <th className="p-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest">Assigned Projects</th>
              <th className="p-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/20 transition-all">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <img src={user.avatar} className="w-10 h-10 rounded-full border border-slate-200" alt="" />
                    <div>
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <select 
                    value={user.role} 
                    onChange={(e) => handleChangeRole(user.id, e.target.value as UserRole)}
                    className="text-xs font-bold border-none bg-slate-100 rounded-lg py-1 px-3 focus:ring-0"
                  >
                    <option value={UserRole.ADMIN}>ADMIN</option>
                    <option value={UserRole.EDITOR}>EDITOR</option>
                    <option value={UserRole.CLIENT}>CLIENT</option>
                  </select>
                </td>
                <td className="p-6">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter ${user.active ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {user.active ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex flex-wrap gap-1">
                    {projects.map(p => (
                      <button 
                        key={p.id}
                        onClick={() => handleAssignProject(user.id, p.id)}
                        className={`text-[9px] font-bold px-2 py-1 rounded-md transition-all ${user.assignedProjects.includes(p.id) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}
                      >
                        {p.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="p-6 text-right">
                  <button 
                    onClick={() => handleToggleStatus(user.id, user.active)}
                    className={`text-xs font-bold py-2 px-4 rounded-xl transition-all ${user.active ? 'text-rose-500 hover:bg-rose-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                  >
                    {user.active ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
