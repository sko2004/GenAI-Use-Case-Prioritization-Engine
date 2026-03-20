import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { NewAssessment } from './pages/NewAssessment';
import { Results } from './pages/Results';
import { History } from './pages/History';
import { Layout } from './components/Layout';

// Mock Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
       <Route path="/login" element={<Login />} />
       
       {/* Protected Routes directly wrapped without intermediate router issues */}
       <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
           <Route index element={<Navigate to="/dashboard" replace />} />
           <Route path="dashboard" element={<Dashboard />} />
           <Route path="assessment/new" element={<NewAssessment />} />
           <Route path="assessment/results" element={<Results />} />
           {/* Final Routes */}
           <Route path="reports" element={<div className="p-10 font-medium text-gray-500 text-center col-span-full">Reports dashboard coming soon</div>} />
           <Route path="history" element={<History />} />
       </Route>
       
       <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
