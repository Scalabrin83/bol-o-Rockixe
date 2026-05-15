import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut } from 'lucide-react';

export function Header() {
  const { userData, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="app-header__logo">
        <img src="/logo-rockixe.png" alt="Rockixe" style={{ height: 28, objectFit: 'contain' }} />
      </div>
      {userData && (
        <div className="app-header__user">
          <span className="app-header__username">{userData.name}</span>
          <button onClick={logout} className="app-header__logout">
            <LogOut size={18} />
          </button>
        </div>
      )}
    </header>
  );
}
