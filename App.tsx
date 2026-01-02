
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './store/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { ProjectDetail } from './pages/ProjectDetail';
import { CalendarPage } from './pages/CalendarPage';
import { AuthPage } from './pages/AuthPage';

// Simple Route Protection
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const ProjectsPlaceholder: React.FC = () => {
  const { projects, currentUser } = useApp();
  return (
    <div className="max-w-7xl mx-auto space-y-6">
       <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Projects</h1>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {projects.map(p => (
           <Navigate key={p.id} to={`/projects/${p.id}`} />
         ))}
       </div>
    </div>
  );
};

const WoodyApp: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
          <Route path="/financials" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default function App() {
  return (
    <AppProvider>
      <WoodyApp />
    </AppProvider>
  );
}
