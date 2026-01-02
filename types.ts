
export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  CLIENT = 'CLIENT'
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: UserRole;
}

export enum ProjectStatus {
  PLANNING = 'Planning',
  ACTIVE = 'Active',
  ON_HOLD = 'On Hold',
  COMPLETED = 'Completed'
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  memberIds: string[];
  status: ProjectStatus;
  timeline: {
    start: string;
    end: string;
  };
  budget: {
    total: number;
    received: number;
  };
}

export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  COMPLETED = 'Completed'
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignedEditorId: string;
  dueDate: string;
  status: TaskStatus;
  value: number; // For budget tracking
}

export interface ContentPost {
  id: string;
  projectId: string;
  date: string;
  platform: 'Instagram' | 'LinkedIn' | 'YouTube' | 'X' | 'TikTok';
  status: 'Draft' | 'Scheduled' | 'Published' | 'Failed';
  editorId: string;
  taskId?: string;
}

export interface AppState {
  currentUser: User | null;
  projects: Project[];
  tasks: Task[];
  users: User[];
  contentPosts: ContentPost[];
}
