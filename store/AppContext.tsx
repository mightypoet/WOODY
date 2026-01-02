
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, User, UserRole, Project, Task, TaskStatus, ContentPost, ProjectStatus } from '../types';

interface AppContextType extends AppState {
  login: (email: string) => Promise<void>;
  logout: () => void;
  addProject: (p: Partial<Project>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  addTask: (t: Partial<Task>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addContentPost: (cp: Partial<ContentPost>) => void;
  updateContentPost: (id: string, updates: Partial<ContentPost>) => void;
  deleteContentPost: (id: string) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_USERS: User[] = [
  { id: 'u1', email: 'reelywood@gmail.com', name: 'Woody Admin', avatar: 'https://picsum.photos/200/200?random=1', role: UserRole.ADMIN, active: true, lastLogin: new Date().toISOString(), assignedProjects: [] },
  { id: 'u2', email: 'editor1@woody.io', name: 'Alex Editor', avatar: 'https://picsum.photos/200/200?random=2', role: UserRole.EDITOR, active: true, lastLogin: new Date().toISOString(), assignedProjects: ['p1', 'p2'] },
  { id: 'u3', email: 'client@brand.com', name: 'Jane Client', avatar: 'https://picsum.photos/200/200?random=3', role: UserRole.CLIENT, active: true, lastLogin: new Date().toISOString(), assignedProjects: ['p1', 'p2'] },
  { id: 'u4', email: 'editor2@woody.io', name: 'Sam Creative', avatar: 'https://picsum.photos/200/200?random=4', role: UserRole.EDITOR, active: true, lastLogin: new Date().toISOString(), assignedProjects: ['p1'] },
];

const INITIAL_PROJECTS: Project[] = [
  { id: 'p1', name: 'Summer Campaign 2024', clientId: 'u3', clientName: 'Brand Co.', memberIds: ['u2', 'u4'], status: ProjectStatus.ACTIVE, timeline: { start: '2024-06-01', end: '2024-08-30' }, budget: { total: 15000, received: 5000 } },
  { id: 'p2', name: 'Social Media Strategy', clientId: 'u3', clientName: 'Brand Co.', memberIds: ['u2'], status: ProjectStatus.PLANNING, timeline: { start: '2024-07-15', end: '2024-12-15' }, budget: { total: 8000, received: 2000 } },
];

const INITIAL_TASKS: Task[] = [
  { id: 't1', projectId: 'p1', title: 'Brainstorm Reels', description: 'Ideate for 30 high engagement reels', assignedEditorId: 'u2', dueDate: '2024-06-15', status: TaskStatus.COMPLETED, value: 500 },
  { id: 't2', projectId: 'p1', title: 'Filming Session 1', description: 'On-site filming with talent', assignedEditorId: 'u2', dueDate: '2024-06-20', status: TaskStatus.IN_PROGRESS, value: 1200 },
];

const INITIAL_POSTS: ContentPost[] = [
  { id: 'cp1', projectId: 'p1', title: 'Match Stories Reel', date: '2024-06-10', platform: 'Instagram', status: 'Published', editorId: 'u2' },
  { id: 'cp2', projectId: 'p1', title: 'Summer Vibe Check', date: '2024-06-12', platform: 'TikTok', status: 'Scheduled', editorId: 'u2' },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [contentPosts, setContentPosts] = useState<ContentPost[]>(INITIAL_POSTS);

  useEffect(() => {
    const savedUser = localStorage.getItem('woody_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      const freshUser = users.find(u => u.id === parsed.id);
      if (freshUser && freshUser.active) setCurrentUser(freshUser);
    }
  }, [users]);

  const login = async (email: string) => {
    const user = users.find(u => u.email === email);
    if (user) {
      if (!user.active) throw new Error('Account suspended');
      const updated = { ...user, lastLogin: new Date().toISOString() };
      updateUser(user.id, updated);
      setCurrentUser(updated);
      localStorage.setItem('woody_user', JSON.stringify(updated));
    } else {
      const newUser: User = {
        id: `u${Date.now()}`,
        email,
        name: email.split('@')[0],
        avatar: `https://picsum.photos/200/200?random=${Date.now()}`,
        role: email === 'reelywood@gmail.com' ? UserRole.ADMIN : UserRole.EDITOR,
        active: true,
        lastLogin: new Date().toISOString(),
        assignedProjects: [],
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      localStorage.setItem('woody_user', JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('woody_user');
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const addProject = (p: Partial<Project>) => {
    const newProject: Project = {
      id: `p${Date.now()}`,
      name: p.name || 'New Project',
      clientId: p.clientId || 'u3',
      clientName: p.clientName || 'Unassigned Client',
      memberIds: p.memberIds || [],
      status: ProjectStatus.PLANNING,
      timeline: p.timeline || { start: new Date().toISOString().split('T')[0], end: new Date().toISOString().split('T')[0] },
      budget: p.budget || { total: 0, received: 0 },
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const addTask = (t: Partial<Task>) => {
    const newTask: Task = {
      id: `t${Date.now()}`,
      projectId: t.projectId || '',
      title: t.title || 'Untitled Task',
      description: t.description || '',
      assignedEditorId: t.assignedEditorId || '',
      dueDate: t.dueDate || new Date().toISOString().split('T')[0],
      status: t.status || TaskStatus.TODO,
      value: t.value || 0,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addContentPost = (cp: Partial<ContentPost>) => {
    const newPost: ContentPost = {
      id: `cp${Date.now()}`,
      projectId: cp.projectId || '',
      title: cp.title || 'New Content Piece',
      date: cp.date || new Date().toISOString().split('T')[0],
      platform: cp.platform || 'Instagram',
      status: cp.status || 'Draft',
      editorId: cp.editorId || '',
      taskId: cp.taskId,
    };
    setContentPosts(prev => [...prev, newPost]);
  };

  const updateContentPost = (id: string, updates: Partial<ContentPost>) => {
    setContentPosts(prev => prev.map(cp => cp.id === id ? { ...cp, ...updates } : cp));
  };

  const deleteContentPost = (id: string) => {
    setContentPosts(prev => prev.filter(cp => cp.id !== id));
  };

  return (
    <AppContext.Provider value={{
      currentUser, projects, tasks, users, contentPosts,
      login, logout, addProject, updateProject, addTask, updateTask, deleteTask, 
      addContentPost, updateContentPost, deleteContentPost, updateUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
