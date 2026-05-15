import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Palpites } from './pages/Palpites';
import { Ranking } from './pages/Ranking';
import { Classificacao } from './pages/Classificacao';
import { Admin } from './pages/Admin';

// Protege rotas que precisam de login
function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

// Layout com Header e BottomNav
function AppLayout({ children }) {
  const { userData } = useAuth();
  const location = useLocation();

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={
            <div className="app-container">
              <Login />
            </div>
          } />
          
          {/* Rotas Privadas */}
          <Route path="/" element={
            <PrivateRoute>
              <AppLayout>
                <Home />
              </AppLayout>
            </PrivateRoute>
          } />
          <Route path="/palpites" element={
            <PrivateRoute>
              <AppLayout>
                <Palpites />
              </AppLayout>
            </PrivateRoute>
          } />
          <Route path="/classificacao" element={
            <PrivateRoute>
              <AppLayout>
                <Classificacao />
              </AppLayout>
            </PrivateRoute>
          } />
          <Route path="/ranking" element={
            <PrivateRoute>
              <AppLayout>
                <Ranking />
              </AppLayout>
            </PrivateRoute>
          } />
          <Route path="/admin" element={
            <PrivateRoute>
              <AppLayout>
                <Admin />
              </AppLayout>
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
