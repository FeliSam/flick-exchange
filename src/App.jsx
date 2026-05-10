import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import MobileLayout from './components/Layout/MobileLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Transfer from './pages/Transfer';
import History from './pages/History';
import Notifications from './pages/Notifications';
import Support from './pages/Support';
import Profile from './pages/Profile';
import Calculator from './pages/Calculator';
import Settings from './pages/Settings';
import Dashboard from './pages/Admin/Dashboard';
import TransfersManagement from './pages/Admin/TransfersManagement';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <MobileLayout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/transfer" element={<ProtectedRoute><Transfer /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/transfers" element={<ProtectedRoute adminOnly><TransfersManagement /></ProtectedRoute>} />
      </Routes>
    </MobileLayout>
  );
}
