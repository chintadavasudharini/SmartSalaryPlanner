import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { IncomePage } from './pages/IncomePage';
import { EMIPage } from './pages/EMIPage';
import { HouseholdPage } from './pages/HouseholdPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { SavingsPage } from './pages/SavingsPage';
import { InvestmentsPage } from './pages/InvestmentsPage';
import { EntertainmentPage } from './pages/EntertainmentPage';
import { GoalsPage } from './pages/GoalsPage';
import { SalaryPlannerPage } from './pages/SalaryPlannerPage';
import { AlgorithmAnalysisPage } from './pages/AlgorithmAnalysisPage';
import { AISalaryManagerPage } from './pages/AISalaryManagerPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-slate-500">Authenticating...</div>;
  }

  // Session persistence fallback
  const hasLocalUser = localStorage.getItem('user_id');

  if (!currentUser && !hasLocalUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Financial Workspace Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/income" element={<ProtectedRoute><IncomePage /></ProtectedRoute>} />
          <Route path="/emi" element={<ProtectedRoute><EMIPage /></ProtectedRoute>} />
          <Route path="/household" element={<ProtectedRoute><HouseholdPage /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} />
          <Route path="/savings" element={<ProtectedRoute><SavingsPage /></ProtectedRoute>} />
          <Route path="/investments" element={<ProtectedRoute><InvestmentsPage /></ProtectedRoute>} />
          <Route path="/entertainment" element={<ProtectedRoute><EntertainmentPage /></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><GoalsPage /></ProtectedRoute>} />
          <Route path="/salary-planner" element={<ProtectedRoute><SalaryPlannerPage /></ProtectedRoute>} />
          <Route path="/algorithm-analysis" element={<ProtectedRoute><AlgorithmAnalysisPage /></ProtectedRoute>} />
          <Route path="/ai-manager" element={<ProtectedRoute><AISalaryManagerPage /></ProtectedRoute>} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
