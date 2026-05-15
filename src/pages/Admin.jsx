import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function Admin() {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [stages, setStages] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [selectedRound, setSelectedRound] = useState('round_g1');
  const [newTeam, setNewTeam] = useState({ id: '', name: '', groupId: '' });
  const [newMatch, setNewMatch] = useState({ stageId: 'group_stage', groupId: 'group_a', teamAId: '', teamBId: '', kickoffLocal: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData?.isAdmin) {
      fetchTeams();
      fetchUsers();
      fetchMatches();
      fetchStages();
      fetchRounds();
    }
  }, [userData]);

  const fetchStages = async () => {
    const snap = await getDocs(collection(db, 'stages'));
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    data.sort((a, b) => a.order - b.order);
    setStages(data);
  };

  const fetchRounds = async () => {
    const snap = await getDocs(collection(db, 'rounds'));
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    data.sort((a, b) => a.order - b.order);
    setRounds(data);
  };

  const fetchMatches = async () => {
    const snap = await getDocs(collection(db, 'matches'));
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    data.sort((a, b) => new Date(a.kickoffLocal) - new Date(b.kickoffLocal));
    setMatches(data);
  };

  const fetchUsers = async () => {
    const snap = await getDocs(collection(db, 'users'));
    const data = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
    // Ordena por nome
    data.sort((a, b) => a.name.localeCompare(b.name));
    setUsers(data);
  };

  const fetchTeams = async () => {
    const snap = await getDocs(collection(db, 'teams'));
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    data.sort((a, b) => a.name.localeCompare(b.name));
    setTeams(data);
    setLoading(false);
  };

  if (!userData?.isAdmin) {
    return <Navigate to="/" />;
  }

  const handleAddTeam = async () => {
    if (!newTeam.id || !newTeam.name) return alert('ID e Nome obrigatórios');
    try {
      await setDoc(doc(db, 'teams', newTeam.id), newTeam);
      alert('Seleção salva com sucesso!');
      setNewTeam({ id: '', name: '', groupId: '' });
      fetchTeams();
    } catch (e) {
      alert('Erro ao salvar.');
    }
  };

  const handleDeleteTeam = async (id) => {
    if (!window.confirm('Certeza que deseja deletar?')) return;
    try {
      await deleteDoc(doc(db, 'teams', id));
      fetchTeams();
    } catch (e) {
      alert('Erro ao deletar.');
    }
  };

  const toggleUserStatus = async (user) => {
    const newStatus = user.status === 'pending' ? 'confirmed' : 'pending';
    try {
      await setDoc(doc(db, 'users', user.uid), { status: newStatus }, { merge: true });
      fetchUsers();
    } catch (e) {
      alert('Erro ao atualizar status.');
    }
  };

  const handleDeleteUser = async (uid) => {
    if (!window.confirm('Certeza que deseja deletar este usuário permanentemente? Todos os palpites e dados dele serão apagados.')) return;
    try {
      await deleteDoc(doc(db, 'users', uid));
      await deleteDoc(doc(db, 'predictions', uid));
      fetchUsers();
    } catch(e) {
      alert('Erro ao excluir usuário');
    }
  };

  const toggleRoundStatus = async (round) => {
    const newStatus = round.predictionStatus === 'locked' ? 'open' : 'locked';
    try {
      await setDoc(doc(db, 'rounds', round.id), { predictionStatus: newStatus }, { merge: true });
      fetchRounds();
    } catch (e) {
      alert('Erro ao atualizar rodada.');
    }
  };

  const handleUpdateMatchTeams = async (matchId, teamAId, teamBId) => {
    try {
      await setDoc(doc(db, 'matches', matchId), { teamAId, teamBId }, { merge: true });
      fetchMatches();
    } catch (e) {
      alert('Erro ao salvar times.');
    }
  };

  const handleSaveMatchResult = async (matchId, scoreA, scoreB, penaltyWinnerId) => {
    try {
      await setDoc(doc(db, 'matches', matchId), { 
        officialScoreA: scoreA, 
        officialScoreB: scoreB,
        officialPenaltyWinnerId: penaltyWinnerId || null,
        status: 'finished'
      }, { merge: true });
      
      alert('Resultado salvo com sucesso! Clique no botão de Recalcular Pontos para atualizar o ranking.');
      fetchMatches();
    } catch(e) {
      console.error(e);
      alert('Erro ao salvar resultado.');
    }
  };

  const recalculateAllScores = async () => {
    try {
      const matchesSnap = await getDocs(collection(db, 'matches'));
      const finishedMatches = matchesSnap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(m => m.status === 'finished');

      // Descobre o campeão se a final já acabou
      let championId = null;
      const finalMatch = finishedMatches.find(m => m.roundId === 'final');
      if (finalMatch) {
        if (finalMatch.officialScoreA > finalMatch.officialScoreB) championId = finalMatch.teamAId;
        else if (finalMatch.officialScoreB > finalMatch.officialScoreA) championId = finalMatch.teamBId;
      }

      const usersSnap = await getDocs(collection(db, 'users'));
      const usersData = [];
      let maxExactScores = 0;

      for (const userDoc of usersSnap.docs) {
        let totalPoints = 0;
        let totalExact = 0;

        const predSnap = await getDoc(doc(db, 'predictions', userDoc.id));
        if (predSnap.exists()) {
          const preds = predSnap.data().matches || {};

          for (const match of finishedMatches) {
            const pred = preds[match.id];
            if (!pred) continue;
            if (pred.scoreA === '' || pred.scoreB === '') continue; // Ignora palpite em branco

            const offA = parseInt(match.officialScoreA);
            const offB = parseInt(match.officialScoreB);
            const predA = parseInt(pred.scoreA);
            const predB = parseInt(pred.scoreB);

            const isKnockout = !match.groupId;
            const ptsForExact = isKnockout ? 6 : 6;
            const ptsForWin = isKnockout ? 3 : 3;

            // Quem passa de fase
            let offQualifier = null;
            let predQualifier = null;

            if (isKnockout) {
              if (offA > offB) offQualifier = match.teamAId;
              else if (offB > offA) offQualifier = match.teamBId;
              else offQualifier = match.officialPenaltyWinnerId;

              if (predA > predB) predQualifier = match.teamAId;
              else if (predB > predA) predQualifier = match.teamBId;
              else predQualifier = pred.penaltyWinnerId;
            }

            if (predA === offA && predB === offB) {
              totalPoints += ptsForExact;
              totalExact += 1;
            } else {
              const offOutcome = offA > offB ? 'A' : offA < offB ? 'B' : 'DRAW';
              const predOutcome = predA > predB ? 'A' : predA < predB ? 'B' : 'DRAW';
              if (offOutcome === predOutcome) {
                totalPoints += ptsForWin;
              }
            }

            // Bônus de "quem passa" no mata-mata
            if (isKnockout && offQualifier && predQualifier === offQualifier) {
              totalPoints += 3;
            }
          }
        }
        
        if (totalExact > maxExactScores) maxExactScores = totalExact;

        usersData.push({
          id: userDoc.id,
          championTeamId: userDoc.data().championTeamId,
          basePoints: totalPoints,
          baseExact: totalExact
        });
      }

      const batch = writeBatch(db);
      for (const u of usersData) {
        let finalPoints = u.basePoints;
        
        // Bônus de Maior Acertador de Exatos
        if (maxExactScores > 0 && u.baseExact === maxExactScores) {
          finalPoints += 10;
        }
        
        // Bônus de Campeão
        if (championId && u.championTeamId === championId) {
          finalPoints += 10;
        }

        batch.update(doc(db, 'users', u.id), {
          points: finalPoints,
          exactScores: u.baseExact
        });
      }

      await batch.commit();
      alert('Pontuações recalculadas com sucesso! Todos os bônus foram aplicados.');
      fetchUsers(); // Atualiza a tela se necessário
    } catch (e) {
      console.error(e);
      alert('Erro ao recalcular pontuações.');
    }
  };

  return (
    <div>
      <h2 className="section-title"><span>Painel Admin</span></h2>
      
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '20px', paddingBottom: '5px' }}>
        <Button variant={activeTab === 'users' ? 'primary' : 'secondary'} onClick={() => setActiveTab('users')} style={{whiteSpace:'nowrap'}}>Usuários</Button>
        <Button variant={activeTab === 'stages' ? 'primary' : 'secondary'} onClick={() => setActiveTab('stages')} style={{whiteSpace:'nowrap'}}>Rodadas</Button>
        <Button variant={activeTab === 'teams' ? 'primary' : 'secondary'} onClick={() => setActiveTab('teams')} style={{whiteSpace:'nowrap'}}>Seleções</Button>
        <Button variant={activeTab === 'matches' ? 'primary' : 'secondary'} onClick={() => setActiveTab('matches')} style={{whiteSpace:'nowrap'}}>Jogos</Button>
      </div>

      {activeTab === 'users' && (
        <Card>
          <h3>Aprovar Participantes</h3>
          <div style={{ marginTop: '16px' }}>
            {users.map(u => (
              <div key={u.uid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', padding: '12px 0' }}>
                <div>
                  <strong style={{ display: 'block' }}>{u.name}</strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{u.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '12px', color: u.status === 'confirmed' ? 'var(--success)' : 'orange', fontWeight: 'bold' }}>
                    {u.status === 'confirmed' ? 'Pago ✅' : 'Pendente ⏳'}
                  </span>
                  <button 
                    onClick={() => toggleUserStatus(u)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: u.status === 'confirmed' ? 'orange' : 'var(--success)',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    {u.status === 'confirmed' ? 'Desfazer' : 'Confirmar Pagto'}
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(u.uid)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'var(--error)',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'stages' && (
        <Card>
          <h3>Liberar/Trancar Rodadas</h3>
          <p style={{fontSize:'14px', color:'var(--text-muted)', marginTop:'10px', marginBottom: '20px'}}>
            Rodadas trancadas impedem qualquer usuário de palpitar nos jogos daquela rodada, independente do horário do jogo.
          </p>
          <div style={{ marginTop: '16px' }}>
            {rounds.map(r => (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', padding: '12px 0' }}>
                <strong style={{ display: 'block' }}>{r.name}</strong>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '12px', color: r.predictionStatus === 'open' ? 'var(--success)' : 'var(--error)' }}>
                    {r.predictionStatus === 'open' ? 'Aberta' : 'Trancada'}
                  </span>
                  <button 
                    onClick={() => toggleRoundStatus(r)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: r.predictionStatus === 'open' ? 'var(--error)' : 'var(--success)',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    {r.predictionStatus === 'open' ? 'Trancar' : 'Liberar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'teams' && (
        <Card>
          <h3>Gerenciar Seleções</h3>
          
          <div style={{ margin: '20px 0', padding: '16px', background: 'var(--bg-dark)', borderRadius: '8px' }}>
            <h4 style={{marginBottom:'10px'}}>Nova Seleção</h4>
            <Input label="ID (ex: brazil)" value={newTeam.id} onChange={e => setNewTeam({...newTeam, id: e.target.value})} />
            <Input label="Nome (ex: Brasil)" value={newTeam.name} onChange={e => setNewTeam({...newTeam, name: e.target.value})} />
            <Input label="Grupo (ex: group_g)" value={newTeam.groupId} onChange={e => setNewTeam({...newTeam, groupId: e.target.value})} />
            <Button onClick={handleAddTeam}>Adicionar / Salvar</Button>
          </div>

          <div>
            {teams.map(team => (
              <div key={team.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems:'center', borderBottom: '1px solid var(--border-color)', padding: '10px 0' }}>
                <div>
                  <strong>{team.name}</strong> <span style={{fontSize:'12px', color:'var(--text-muted)'}}>({team.groupId})</span>
                </div>
                <button onClick={() => handleDeleteTeam(team.id)} style={{ background:'transparent', color:'var(--error)', border:'none', cursor:'pointer' }}>Excluir</button>
              </div>
            ))}
          </div>
        </Card>
      )}
      
      {activeTab === 'matches' && (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>Resultados Oficiais</h3>
            <Button onClick={recalculateAllScores} style={{ background: 'var(--success)', color: '#fff', border: 'none' }}>
              🔄 Recalcular Pontos
            </Button>
          </div>
          <p style={{fontSize:'13px', color:'var(--text-muted)', marginTop:'8px', marginBottom:'16px'}}>
            Selecione a rodada, escolha os times de cada jogo e lance resultados.
          </p>

          <select 
            value={selectedRound} 
            onChange={e => setSelectedRound(e.target.value)}
            style={{width:'100%', padding:'12px', borderRadius:'8px', marginBottom:'20px', background:'var(--bg-dark)', color:'#fff', border:'1px solid var(--border-color)', fontSize:'15px'}}
          >
            {rounds.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>

          {matches.filter(m => m.roundId === selectedRound).map(m => (
            <MatchRow 
              key={m.id} 
              match={m} 
              teams={teams} 
              onSave={handleSaveMatchResult}
              onUpdateTeams={handleUpdateMatchTeams}
            />
          ))}

          {matches.filter(m => m.roundId === selectedRound).length === 0 && (
            <p style={{textAlign:'center', color:'var(--text-muted)', padding:'20px'}}>Nenhum jogo nesta rodada.</p>
          )}
        </Card>
      )}
    </div>
  );
}

function MatchRow({ match: m, teams, onSave, onUpdateTeams }) {
  const [localScoreA, setLocalScoreA] = useState(m.officialScoreA ?? '');
  const [localScoreB, setLocalScoreB] = useState(m.officialScoreB ?? '');
  const [teamA, setTeamA] = useState(m.teamAId || '');
  const [teamB, setTeamB] = useState(m.teamBId || '');
  const [localPenaltyWinnerId, setLocalPenaltyWinnerId] = useState(m.officialPenaltyWinnerId || '');
  const [saving, setSaving] = useState(false);

  const selStyle = { width:'100%', padding:'8px', borderRadius:'6px', background:'var(--bg-dark)', color:'#fff', border:'1px solid var(--border-color)', fontSize:'13px' };
  const teamAName = teams.find(t => t.id === m.teamAId)?.name;
  const teamBName = teams.find(t => t.id === m.teamBId)?.name;
  const isFinished = m.status === 'finished';
  
  const isKnockout = !m.groupId;
  const isTie = localScoreA !== '' && localScoreB !== '' && localScoreA === localScoreB;
  const needsPenaltyWinner = isKnockout && isTie;

  const handleSaveTeams = async () => {
    if (!teamA || !teamB) return alert('Selecione as duas seleções.');
    setSaving(true);
    await onUpdateTeams(m.id, teamA, teamB);
    setSaving(false);
  };

  return (
    <div style={{ borderBottom: '1px solid var(--border-color)', padding:'16px 0', display:'flex', flexDirection:'column', gap:'10px' }}>
      {/* Header: número, grupo, data, estádio */}
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>
          Jogo {m.matchNumber} {m.groupId ? `• ${m.groupId.replace('group_','Grupo ').toUpperCase()}` : ''}
        </div>
        <div style={{ fontSize:'14px', fontWeight:'bold', color:'var(--primary)', marginTop:'2px' }}>
          {new Date(m.kickoffLocal).toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })}
        </div>
        <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>{m.stadium} — {m.city}</div>
      </div>

      {/* Seleção de times */}
      {!m.teamAId || !m.teamBId ? (
        <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
          <select value={teamA} onChange={e => setTeamA(e.target.value)} style={selStyle}>
            <option value=''>Seleção A...</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <div style={{textAlign:'center', fontSize:'12px', color:'var(--text-muted)'}}>VS</div>
          <select value={teamB} onChange={e => setTeamB(e.target.value)} style={selStyle}>
            <option value=''>Seleção B...</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <Button onClick={handleSaveTeams} disabled={saving} style={{padding:'8px', fontSize:'13px'}}>
            {saving ? 'Salvando...' : 'Definir Times'}
          </Button>
        </div>
      ) : (
        <>
          {/* Times já definidos + placar */}
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:'12px' }}>
            <div style={{ flex:1, textAlign:'right', fontWeight:'bold', fontSize:'15px' }}>{teamAName}</div>
            <div style={{ display:'flex', gap:'6px', alignItems:'center' }}>
              <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength="2" value={localScoreA} onChange={e => setLocalScoreA(e.target.value)}
                style={{ width:'38px', height:'38px', textAlign:'center', fontSize:'18px', borderRadius:'6px', border:'1px solid var(--border-color)', background:'var(--bg-dark)', color:'#fff' }} />
              <span style={{fontWeight:'bold'}}>X</span>
              <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength="2" value={localScoreB} onChange={e => setLocalScoreB(e.target.value)}
                style={{ width:'38px', height:'38px', textAlign:'center', fontSize:'18px', borderRadius:'6px', border:'1px solid var(--border-color)', background:'var(--bg-dark)', color:'#fff' }} />
            </div>
            <div style={{ flex:1, textAlign:'left', fontWeight:'bold', fontSize:'15px' }}>{teamBName}</div>
          </div>

            {needsPenaltyWinner && !isFinished && (
              <div style={{ marginTop: '10px', padding: '10px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid rgba(212,168,67,0.3)', alignSelf: 'center' }}>
                <div style={{ fontSize: '11px', textAlign: 'center', marginBottom: '5px', color: 'var(--primary)' }}>QUEM VENCEU NOS PÊNALTIS?</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setLocalPenaltyWinnerId(m.teamAId)} style={{ padding: '6px', borderRadius: '4px', background: localPenaltyWinnerId === m.teamAId ? 'var(--primary)' : 'transparent', color: localPenaltyWinnerId === m.teamAId ? '#000' : '#fff', border: '1px solid var(--primary)', cursor: 'pointer', fontSize: '12px' }}>{teamAName}</button>
                  <button onClick={() => setLocalPenaltyWinnerId(m.teamBId)} style={{ padding: '6px', borderRadius: '4px', background: localPenaltyWinnerId === m.teamBId ? 'var(--primary)' : 'transparent', color: localPenaltyWinnerId === m.teamBId ? '#000' : '#fff', border: '1px solid var(--primary)', cursor: 'pointer', fontSize: '12px' }}>{teamBName}</button>
                </div>
              </div>
            )}

            {!isFinished && (
              <Button variant="secondary" onClick={() => {
                if (needsPenaltyWinner && !localPenaltyWinnerId) return alert('Selecione quem venceu nos pênaltis.');
                onSave(m.id, parseInt(localScoreA,10), parseInt(localScoreB,10), localPenaltyWinnerId);
              }}
                style={{ alignSelf:'center', padding:'6px 14px', fontSize:'12px', width:'auto', marginTop: '10px' }}>
                Salvar Resultado Oficial
              </Button>
            )}
          {isFinished && (
            <div style={{textAlign:'center', fontSize:'12px', color:'var(--success)', fontWeight:'bold'}}>✓ ENCERRADO ({m.officialScoreA} x {m.officialScoreB})</div>
          )}
        </>
      )}
    </div>
  );
}
