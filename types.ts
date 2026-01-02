
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
  active: boolean;
  lastLogin: string;
  assignedProjects: string[]; // Projects the user has access to
}

export enum ProjectStatus {
  PLANNING = 'Planning',
  ACTIVE = 'Active',
  ON_HOLD = 'On Hold',
  COMPLETED = 'Completed'
}

export interface BudgetBreakdown {
  id: string;
  label: string;
  value: number;
}

export interface ProjectBudget {
  total: number;
  received: number;
  breakdown: BudgetBreakdown[];
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
  budget: ProjectBudget;
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
  value: number; // Linked to budget progress
}

export interface ContentPost {
  id: string;
  projectId: string;
  title: string;
  date: string;
  platform: 'Instagram' | 'LinkedIn' | 'YouTube' | 'X' | 'TikTok' | 'Facebook';
  status: 'Scheduled' | 'Done' | 'Pending';
  editorId: string;
}

export interface AppState {
  currentUser: User | null;
  projects: Project[];
  tasks: Task[];
  users: User[];
  contentPosts: ContentPost[];
}
