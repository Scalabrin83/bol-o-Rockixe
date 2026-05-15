import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

const GROUP_IDS = ['group_a','group_b','group_c','group_d','group_e','group_f','group_g','group_h','group_i','group_j','group_k','group_l'];

export function Classificacao() {
  const [teams, setTeams] = useState({});
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('group_a');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsSnap, matchesSnap] = await Promise.all([
          getDocs(collection(db, 'teams')),
          getDocs(collection(db, 'matches')),
        ]);
        const teamsObj = {};
        teamsSnap.docs.forEach(d => { teamsObj[d.id] = d.data(); });
        setTeams(teamsObj);
        setMatches(matchesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calcula classificação de um grupo
  const getGroupStandings = (groupId) => {
    const groupTeams = Object.entries(teams)
      .filter(([, t]) => t.groupId === groupId)
      .map(([id]) => id);

    const finishedMatches = matches.filter(
      m => m.groupId === groupId && m.status === 'finished' && m.teamAId && m.teamBId
    );

    const stats = {};
    groupTeams.forEach(id => {
      stats[id] = { id, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
    });

    finishedMatches.forEach(m => {
      const a = stats[m.teamAId];
      const b = stats[m.teamBId];
      if (!a || !b) return;

      const gA = m.officialScoreA;
      const gB = m.officialScoreB;

      a.p++; b.p++;
      a.gf += gA; a.ga += gB;
      b.gf += gB; b.ga += gA;

      if (gA > gB) { a.w++; a.pts += 3; b.l++; }
      else if (gB > gA) { b.w++; b.pts += 3; a.l++; }
      else { a.d++; b.d++; a.pts += 1; b.pts += 1; }
    });

    return Object.values(stats)
      .sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf);
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 80, color: 'var(--text-muted)' }}>Carregando...</div>;

  const standings = getGroupStandings(selectedGroup);
  const groupLabel = selectedGroup.replace('group_', '').toUpperCase();

  return (
    <div className="animate-in">
      <h2 className="section-title"><span>Classificação</span></h2>

      {/* Group pills */}
      <div className="round-selector">
        {GROUP_IDS.map(gid => {
          const label = gid.replace('group_', '').toUpperCase();
          return (
            <button
              key={gid}
              className={`round-selector__btn ${selectedGroup === gid ? 'round-selector__btn--active' : ''}`}
              onClick={() => setSelectedGroup(gid)}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="card card--flush">
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--primary)' }}>
            Grupo {groupLabel}
          </span>
        </div>

        {/* Header */}
        <div className="group-table__header">
          <div className="group-table__team-col">Seleção</div>
          <div className="group-table__stat">P</div>
          <div className="group-table__stat">V</div>
          <div className="group-table__stat">E</div>
          <div className="group-table__stat">D</div>
          <div className="group-table__stat">GP</div>
          <div className="group-table__stat">GC</div>
          <div className="group-table__stat">SG</div>
          <div className="group-table__stat group-table__stat--pts">Pts</div>
        </div>

        {/* Rows */}
        {standings.map((s, i) => {
          const isQualified = i < 2;
          const isThird = i === 2;
          return (
            <div key={s.id} className={`group-table__row ${isQualified ? 'group-table__row--qualified' : ''} ${isThird ? 'group-table__row--third' : ''}`}>
              <div className="group-table__team-col">
                <span className="group-table__pos">{i + 1}</span>
                <span className="group-table__name">{teams[s.id]?.name || s.id}</span>
              </div>
              <div className="group-table__stat">{s.p}</div>
              <div className="group-table__stat">{s.w}</div>
              <div className="group-table__stat">{s.d}</div>
              <div className="group-table__stat">{s.l}</div>
              <div className="group-table__stat">{s.gf}</div>
              <div className="group-table__stat">{s.ga}</div>
              <div className="group-table__stat">{s.gf - s.ga}</div>
              <div className="group-table__stat group-table__stat--pts">{s.pts}</div>
            </div>
          );
        })}

        {standings.length === 0 && (
          <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            Nenhum time cadastrado neste grupo.
          </div>
        )}

        {/* Legend */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-muted)' }}>
          <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: 'var(--success)', marginRight: 4 }}></span>Classificado</span>
          <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: 'var(--warning)', marginRight: 4 }}></span>Possível 3º</span>
        </div>
      </div>

      {/* Group matches */}
      <div style={{ marginTop: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 12 }}>
          Jogos do Grupo {groupLabel}
        </h3>
        {matches
          .filter(m => m.groupId === selectedGroup && m.teamAId && m.teamBId)
          .sort((a, b) => new Date(a.kickoffLocal) - new Date(b.kickoffLocal))
          .map(m => {
            const isFinished = m.status === 'finished';
            return (
              <div key={m.id} className="card" style={{ marginBottom: 8, padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, textAlign: 'right', fontSize: 13, fontWeight: 700 }}>
                    {teams[m.teamAId]?.name}
                  </div>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    {isFinished ? (
                      <>
                        <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)', width: 24, textAlign: 'center' }}>{m.officialScoreA}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>×</span>
                        <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)', width: 24, textAlign: 'center' }}>{m.officialScoreB}</span>
                      </>
                    ) : (
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', padding: '2px 8px', background: 'var(--bg-surface)', borderRadius: 6 }}>
                        {new Date(m.kickoffLocal).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <div style={{ flex: 1, textAlign: 'left', fontSize: 13, fontWeight: 700 }}>
                    {teams[m.teamBId]?.name}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
