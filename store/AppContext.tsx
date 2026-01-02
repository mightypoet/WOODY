
import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { AppState, User, UserRole, Project, Task, TaskStatus, ContentPost, ProjectStatus } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyDQ-414RHU1aO49rMGgzUuVRxUUJCbaUEA",
  authDomain: "woody-66f57.firebaseapp.com",
  projectId: "woody-66f57",
  storageBucket: "woody-66f57.firebasestorage.app",
  messagingSenderId: "820455609658",
  appId: "1:820455609658:web:a44758acd991c209e36c03",
  measurementId: "G-MF3SMRBJKB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

interface AppContextType extends AppState {
  login: () => Promise<void>;
  loginByEmail: (email: string) => Promise<void>;
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

// Initial Static Data
const INITIAL_USERS: User[] = [
  { id: 'u1', email: 'rohan00as@gmail.com', name: 'Rohan Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan', role: UserRole.ADMIN, active: true, lastLogin: new Date().toISOString(), assignedProjects: [] },
  { id: 'u2', email: 'editor@woody.agency', name: 'Sarah Editor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', role: UserRole.EDITOR, active: true, lastLogin: new Date().toISOString(), assignedProjects: ['p1'] },
  { id: 'u3', email: 'client@brand.com', name: 'Mark Client', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mark', role: UserRole.CLIENT, active: true, lastLogin: new Date().toISOString(), assignedProjects: ['p1'] },
];

const INITIAL_PROJECTS: Project[] = [
  { 
    id: 'p1', 
    name: 'Brand Refresh 2025', 
    clientId: 'u3', 
    clientName: 'Global Brand Corp', 
    memberIds: ['u2'], 
    status: ProjectStatus.ACTIVE, 
    timeline: { start: '2025-01-01', end: '2025-06-01' }, 
    budget: { 
      total: 25000, 
      received: 10000, 
      breakdown: [
        { id: 'b1', label: 'Design Phase', value: 8000 },
        { id: 'b2', label: 'Content Production', value: 12000 },
        { id: 'b3', label: 'Marketing Spend', value: 5000 }
      ] 
    } 
  },
];

const INITIAL_TASKS: Task[] = [
  { id: 't1', projectId: 'p1', title: 'Logo Concepts', description: 'Create 3 main brand identity routes', assignedEditorId: 'u2', dueDate: '2025-03-20', status: TaskStatus.IN_PROGRESS, value: 3000 },
  { id: 't2', projectId: 'p1', title: 'Brand Guidelines', description: 'Finalize typography and color rules', assignedEditorId: 'u2', dueDate: '2025-04-10', status: TaskStatus.TODO, value: 5000 },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(() => JSON.parse(localStorage.getItem('woody_users') || JSON.stringify(INITIAL_USERS)));
  const [projects, setProjects] = useState<Project[]>(() => JSON.parse(localStorage.getItem('woody_projects') || JSON.stringify(INITIAL_PROJECTS)));
  const [tasks, setTasks] = useState<Task[]>(() => JSON.parse(localStorage.getItem('woody_tasks') || JSON.stringify(INITIAL_TASKS)));
  const [contentPosts, setContentPosts] = useState<ContentPost[]>(() => JSON.parse(localStorage.getItem('woody_posts') || '[]'));

  useEffect(() => {
    localStorage.setItem('woody_users', JSON.stringify(users));
    localStorage.setItem('woody_projects', JSON.stringify(projects));
    localStorage.setItem('woody_tasks', JSON.stringify(tasks));
    localStorage.setItem('woody_posts', JSON.stringify(contentPosts));
  }, [users, projects, tasks, contentPosts]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        syncUser(firebaseUser.email!, firebaseUser.displayName, firebaseUser.photoURL, firebaseUser.uid);
      } else {
        // Fallback for manual session persistence
        const savedSession = localStorage.getItem('woody_current_user_id');
        if (savedSession) {
          const user = users.find(u => u.id === savedSession);
          if (user && user.active) setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
      }
    });
    return () => unsubscribe();
  }, [users]);

  const syncUser = (email: string, name: string | null, avatar: string | null, id: string) => {
    let user = users.find(u => u.email === email);
    if (!user) {
      user = {
        id: id || `u${Date.now()}`,
        email: email,
        name: name || email.split('@')[0],
        avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        role: email === 'rohan00as@gmail.com' ? UserRole.ADMIN : UserRole.EDITOR,
        active: true,
        lastLogin: new Date().toISOString(),
        assignedProjects: [],
      };
      setUsers(prev => [...prev, user!]);
    } else if (!user.active) {
      signOut(auth);
      localStorage.removeItem('woody_current_user_id');
      throw new Error('Account suspended');
    }
    
    setCurrentUser(user);
    localStorage.setItem('woody_current_user_id', user.id);
  };

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        syncUser(result.user.email!, result.user.displayName, result.user.photoURL, result.user.uid);
      }
    } catch (error: any) {
      console.error("Login failed", error);
      if (error.code === 'auth/unauthorized-domain') {
        throw new Error('Firebase Auth: This domain is not authorized. Please add it to Authorized Domains in Firebase Console, or use Manual Login.');
      }
      throw error;
    }
  };

  const loginByEmail = async (email: string) => {
    // Simulated manual login for environments where Google Auth domain is restricted
    syncUser(email, null, null, `u_manual_${Date.now()}`);
  };

  const logout = () => {
    signOut(auth);
    setCurrentUser(null);
    localStorage.removeItem('woody_current_user_id');
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const addProject = (p: Partial<Project>) => {
    const newProject: Project = {
      id: `p${Date.now()}`,
      name: p.name || 'New Project',
      clientId: p.clientId || '',
      clientName: p.clientName || 'Unassigned',
      memberIds: p.memberIds || [],
      status: ProjectStatus.PLANNING,
      timeline: p.timeline || { start: new Date().toISOString().split('T')[0], end: new Date().toISOString().split('T')[0] },
      budget: p.budget || { total: 0, received: 0, breakdown: [] },
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
      title: cp.title || 'Post Idea',
      date: cp.date || new Date().toISOString().split('T')[0],
      platform: cp.platform || 'Instagram',
      status: cp.status || 'Pending',
      editorId: cp.editorId || '',
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
      login, loginByEmail, logout, addProject, updateProject, addTask, updateTask, deleteTask, 
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
