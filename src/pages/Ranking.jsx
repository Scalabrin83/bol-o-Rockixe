import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function Ranking() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('geral'); // 'geral' | 'exatos'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersSnap, teamsSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'teams')),
        ]);
        const teamsObj = {};
        teamsSnap.docs.forEach(d => { teamsObj[d.id] = d.data(); });
        setTeams(teamsObj);

        const data = usersSnap.docs
          .map(d => ({ uid: d.id, ...d.data() }))
          .filter(u => u.status === 'confirmed' && (!u.isAdmin || u.championTeamId));
          
        setUsers(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: 80, color: 'var(--text-muted)' }}>Carregando ranking...</div>;

  const sortedUsers = [...users].sort((a, b) => {
    if (tab === 'geral') {
      return (b.points || 0) - (a.points || 0) || (b.exactScores || 0) - (a.exactScores || 0);
    } else {
      return (b.exactScores || 0) - (a.exactScores || 0) || (b.points || 0) - (a.points || 0);
    }
  });

  const getPosClass = (i) => {
    if (i === 0) return 'ranking-item__pos--1';
    if (i === 1) return 'ranking-item__pos--2';
    if (i === 2) return 'ranking-item__pos--3';
    return 'ranking-item__pos--default';
  };

  return (
    <div className="animate-in">
      <h2 className="section-title"><span>Ranking</span></h2>

      <div style={{ display: 'flex', width: '100%', gap: '8px', marginBottom: '20px' }}>
        <button 
          className={`round-selector__btn ${tab === 'geral' ? 'round-selector__btn--active' : ''}`}
          style={{ flex: 1, textAlign: 'center' }}
          onClick={() => setTab('geral')}
        >
          Geral (Pontos)
        </button>
        <button 
          className={`round-selector__btn ${tab === 'exatos' ? 'round-selector__btn--active' : ''}`}
          style={{ flex: 1, textAlign: 'center' }}
          onClick={() => setTab('exatos')}
        >
          Placares Exatos
        </button>
      </div>

      <div className="card card--flush">
        {sortedUsers.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            Nenhum participante confirmado ainda.
          </div>
        )}

        {sortedUsers.map((u, i) => (
          <div key={u.uid} className={`ranking-item ${i < 3 ? 'ranking-item--top' : ''}`}>
            <div className={`ranking-item__pos ${getPosClass(i)}`}>
              {i + 1}
            </div>

            <div className="ranking-item__info">
              <div className="ranking-item__name">{u.name}</div>
              {u.championTeamId && (
                <div className="ranking-item__champion">🏆 {teams[u.championTeamId]?.name || u.championTeamId}</div>
              )}
            </div>

            <div className="ranking-item__points">
              <div className="ranking-item__score" style={{ 
                color: tab === 'exatos' ? 'var(--text-secondary)' : 'var(--primary)',
                fontSize: tab === 'exatos' ? 14 : 20,
                fontWeight: tab === 'exatos' ? 600 : 800
              }}>
                {u.points || 0} <span style={{ fontSize: 11, fontWeight: 500 }}>pts</span>
              </div>
              <div className="ranking-item__exact" style={{ 
                color: tab === 'exatos' ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: tab === 'exatos' ? 14 : 11,
                fontWeight: tab === 'exatos' ? 800 : 500,
                marginTop: tab === 'exatos' ? 2 : 0
              }}>
                {u.exactScores || 0} exatos
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
