// src/App.jsx - 最终版本
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import Login from './Components/Login';
import Register from './Components/Register';

// 你现有的页面组件
import Dashboard from './Pages/Dashboard';
import IncomePage from './Pages/IncomePage'; 
import ExpensePage from './Pages/ExpensePage';

// CSS
import './App.css';
import './Components/Loading.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* 公开路由 */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* 保护的路由 */}
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/income" element={
              <ProtectedRoute>
                <IncomePage />
              </ProtectedRoute>
            } />
            
            <Route path="/expense" element={
              <ProtectedRoute>
                <ExpensePage />
              </ProtectedRoute>
            } />
            
            {/* 捕获所有其他路由 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;