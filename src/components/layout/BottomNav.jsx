import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Trophy, List, Table2, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function BottomNav() {
  const location = useLocation();
  const { userData } = useAuth();
  if (!userData) return null;

  const isActive = (path) => location.pathname === path;

  const items = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/palpites', icon: List, label: 'Palpites' },
    { path: '/classificacao', icon: Table2, label: 'Grupos' },
    { path: '/ranking', icon: Trophy, label: 'Ranking' },
  ];
  if (userData?.isAdmin) {
    items.push({ path: '/admin', icon: Settings, label: 'Admin' });
  }

  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <Link 
          key={item.path} 
          to={item.path} 
          className={`bottom-nav__link ${isActive(item.path) ? 'bottom-nav__link--active' : ''}`}
        >
          <item.icon size={22} />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
