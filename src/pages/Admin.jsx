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

  const handleAutoResolveKnockouts = async () => {
    if (!window.confirm("Deseja gerar/atualizar automaticamente todos os confrontos do mata-mata com base nos resultados dos grupos? (Mudanças manuais não salvas serão sobrescritas)")) return;
    
    const GROUP_IDS = ['group_a','group_b','group_c','group_d','group_e','group_f','group_g','group_h','group_i','group_j','group_k','group_l'];
    
    // 1. Calcular a classificação local para cada um dos 12 grupos
    const standingsByGroup = {};
    for (const gid of GROUP_IDS) {
      const groupTeams = teams.filter(t => t.groupId === gid).map(t => t.id);
      const finishedGroupMatches = matches.filter(
        m => m.groupId === gid && m.status === 'finished' && m.teamAId && m.teamBId
      );
      
      const stats = {};
      groupTeams.forEach(id => {
        stats[id] = { id, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
      });
      
      finishedGroupMatches.forEach(m => {
        const a = stats[m.teamAId];
        const b = stats[m.teamBId];
        if (!a || !b) return;
        
        const gA = parseInt(m.officialScoreA, 10);
        const gB = parseInt(m.officialScoreB, 10);
        
        a.p++; b.p++;
        a.gf += gA; a.ga += gB;
        b.gf += gB; b.ga += gA;
        
        if (gA > gB) { a.w++; a.pts += 3; b.l++; }
        else if (gB > gA) { b.w++; b.pts += 3; a.l++; }
        else { a.d++; b.d++; a.pts += 1; b.pts += 1; }
      });
      
      const sorted = Object.values(stats).sort((a, b) => 
        b.pts - a.pts || 
        (b.gf - b.ga) - (a.gf - a.ga) || 
        b.gf - a.gf
      );
      standingsByGroup[gid] = sorted;
    }

    // 2. Extrair 1os, 2os e 3os
    const firstPlaces = {};
    const secondPlaces = {};
    const thirdPlacesList = [];
    
    for (const gid of GROUP_IDS) {
      const list = standingsByGroup[gid] || [];
      if (list[0]) firstPlaces[gid] = list[0].id;
      if (list[1]) secondPlaces[gid] = list[1].id;
      if (list[2]) {
        thirdPlacesList.push({
          id: list[2].id,
          groupId: gid,
          pts: list[2].pts,
          sg: list[2].gf - list[2].ga,
          gp: list[2].gf
        });
      }
    }

    // 3. Ordenar 3os colocados para selecionar os 8 melhores
    thirdPlacesList.sort((a, b) => 
      b.pts - a.pts || 
      b.sg - a.sg || 
      b.gp - a.gp
    );
    const bestEightThirds = thirdPlacesList.slice(0, 8);

    // 4. Backtracking para resolver os 8 terceiros colocados contra os 8 vencedores de grupo elegíveis
    const slots = [
      { matchId: 'm074', groupWinner: 'group_e', allowedGroups: ['group_a', 'group_b', 'group_c', 'group_d', 'group_f'] },
      { matchId: 'm077', groupWinner: 'group_i', allowedGroups: ['group_c', 'group_d', 'group_f', 'group_g', 'group_h'] },
      { matchId: 'm079', groupWinner: 'group_a', allowedGroups: ['group_c', 'group_e', 'group_f', 'group_h', 'group_i'] },
      { matchId: 'm080', groupWinner: 'group_l', allowedGroups: ['group_e', 'group_h', 'group_i', 'group_j', 'group_k'] },
      { matchId: 'm081', groupWinner: 'group_d', allowedGroups: ['group_b', 'group_e', 'group_f', 'group_i', 'group_j'] },
      { matchId: 'm082', groupWinner: 'group_g', allowedGroups: ['group_a', 'group_e', 'group_h', 'group_i', 'group_j'] },
      { matchId: 'm085', groupWinner: 'group_b', allowedGroups: ['group_e', 'group_f', 'group_g', 'group_i', 'group_j'] },
      { matchId: 'm087', groupWinner: 'group_k', allowedGroups: ['group_d', 'group_e', 'group_i', 'group_j', 'group_l'] }
    ];

    const thirdsAssignment = {};
    const usedThirds = new Set();
    
    function backtrack(slotIndex) {
      if (slotIndex === slots.length) return true;
      const slot = slots[slotIndex];
      for (const team of bestEightThirds) {
        if (usedThirds.has(team.id)) continue;
        if (slot.allowedGroups.includes(team.groupId)) {
          thirdsAssignment[slot.matchId] = team.id;
          usedThirds.add(team.id);
          if (backtrack(slotIndex + 1)) return true;
          usedThirds.delete(team.id);
          delete thirdsAssignment[slot.matchId];
        }
      }
      return false;
    }
    
    const backtrackingSuccess = backtrack(0);
    
    // Fallback em caso de falha de backtracking (Copa do Mundo modificada ou teste manual)
    if (!backtrackingSuccess) {
      const remainingThirds = [...bestEightThirds];
      for (const slot of slots) {
        const team = remainingThirds.find(t => slot.allowedGroups.includes(t.groupId)) || remainingThirds[0];
        if (team) {
          thirdsAssignment[slot.matchId] = team.id;
          const idx = remainingThirds.indexOf(team);
          if (idx > -1) remainingThirds.splice(idx, 1);
        }
      }
    }

    // 5. Mapear o chaveamento completo da rodada de 32-avos
    const r32Mappings = {
      m073: { teamA: secondPlaces['group_a'], teamB: secondPlaces['group_b'] },
      m074: { teamA: firstPlaces['group_e'], teamB: thirdsAssignment['m074'] },
      m075: { teamA: firstPlaces['group_f'], teamB: secondPlaces['group_c'] },
      m076: { teamA: firstPlaces['group_c'], teamB: secondPlaces['group_f'] },
      m077: { teamA: firstPlaces['group_i'], teamB: thirdsAssignment['m077'] },
      m078: { teamA: secondPlaces['group_e'], teamB: secondPlaces['group_i'] },
      m079: { teamA: firstPlaces['group_a'], teamB: thirdsAssignment['m079'] },
      m080: { teamA: firstPlaces['group_l'], teamB: thirdsAssignment['m080'] },
      m081: { teamA: firstPlaces['group_d'], teamB: thirdsAssignment['m081'] },
      m082: { teamA: firstPlaces['group_g'], teamB: thirdsAssignment['m082'] },
      m083: { teamA: secondPlaces['group_k'], teamB: secondPlaces['group_l'] },
      m084: { teamA: firstPlaces['group_h'], teamB: secondPlaces['group_j'] },
      m085: { teamA: firstPlaces['group_b'], teamB: thirdsAssignment['m085'] },
      m086: { teamA: firstPlaces['group_j'], teamB: secondPlaces['group_h'] },
      m087: { teamA: firstPlaces['group_k'], teamB: thirdsAssignment['m087'] },
      m088: { teamA: secondPlaces['group_d'], teamB: secondPlaces['group_g'] }
    };

    const updatedMatches = matches.map(m => ({ ...m }));
    
    // 6. Atualizar a rodada de 32-avos no array local
    for (const m of updatedMatches) {
      if (m.roundId === 'round_32') {
        const mapping = r32Mappings[m.id];
        if (mapping) {
          m.teamAId = mapping.teamA || null;
          m.teamBId = mapping.teamB || null;
        }
      }
    }

    // 7. Funções auxiliares para propagação dinâmica
    const getWinnerId = (matchId) => {
      const matchObj = updatedMatches.find(x => x.id === matchId);
      if (!matchObj || matchObj.status !== 'finished') return null;
      
      const sA = parseInt(matchObj.officialScoreA, 10);
      const sB = parseInt(matchObj.officialScoreB, 10);
      if (isNaN(sA) || isNaN(sB)) return null;
      
      if (sA > sB) return matchObj.teamAId;
      if (sB > sA) return matchObj.teamBId;
      return matchObj.officialPenaltyWinnerId || null;
    };

    const getLoserId = (matchId) => {
      const matchObj = updatedMatches.find(x => x.id === matchId);
      if (!matchObj || matchObj.status !== 'finished') return null;
      
      const sA = parseInt(matchObj.officialScoreA, 10);
      const sB = parseInt(matchObj.officialScoreB, 10);
      if (isNaN(sA) || isNaN(sB)) return null;
      
      if (sA > sB) return matchObj.teamBId;
      if (sB > sA) return matchObj.teamAId;
      if (matchObj.officialPenaltyWinnerId === matchObj.teamAId) return matchObj.teamBId;
      if (matchObj.officialPenaltyWinnerId === matchObj.teamBId) return matchObj.teamAId;
      return null;
    };

    // Mapeamento das rodadas subsequentes
    const r16Mappings = {
      m089: { depA: 'm074', depB: 'm077' },
      m090: { depA: 'm073', depB: 'm075' },
      m091: { depA: 'm076', depB: 'm078' },
      m092: { depA: 'm079', depB: 'm080' },
      m093: { depA: 'm083', depB: 'm084' },
      m094: { depA: 'm081', depB: 'm082' },
      m095: { depA: 'm086', depB: 'm088' },
      m096: { depA: 'm085', depB: 'm087' }
    };

    const qfMappings = {
      m097: { depA: 'm089', depB: 'm090' },
      m098: { depA: 'm093', depB: 'm094' },
      m099: { depA: 'm091', depB: 'm092' },
      m100: { depA: 'm095', depB: 'm096' }
    };

    const sfMappings = {
      m101: { depA: 'm097', depB: 'm098' },
      m102: { depA: 'm099', depB: 'm100' }
    };

    const finalMappings = {
      m103: { depA: 'm101', depB: 'm102', isLosers: true },
      m104: { depA: 'm101', depB: 'm102', isLosers: false }
    };

    // 8. Propagação em cascata no array local
    for (const m of updatedMatches) {
      const mapping = r16Mappings[m.id];
      if (mapping) {
        m.teamAId = getWinnerId(mapping.depA);
        m.teamBId = getWinnerId(mapping.depB);
      }
    }

    for (const m of updatedMatches) {
      const mapping = qfMappings[m.id];
      if (mapping) {
        m.teamAId = getWinnerId(mapping.depA);
        m.teamBId = getWinnerId(mapping.depB);
      }
    }

    for (const m of updatedMatches) {
      const mapping = sfMappings[m.id];
      if (mapping) {
        m.teamAId = getWinnerId(mapping.depA);
        m.teamBId = getWinnerId(mapping.depB);
      }
    }

    for (const m of updatedMatches) {
      const mapping = finalMappings[m.id];
      if (mapping) {
        if (mapping.isLosers) {
          m.teamAId = getLoserId(mapping.depA);
          m.teamBId = getLoserId(mapping.depB);
        } else {
          m.teamAId = getWinnerId(mapping.depA);
          m.teamBId = getWinnerId(mapping.depB);
        }
      }
    }

    // 9. Gravar as mudanças em batch no Firestore
    try {
      const batch = writeBatch(db);
      let count = 0;
      for (const m of updatedMatches) {
        const original = matches.find(x => x.id === m.id);
        if (original && (original.teamAId !== m.teamAId || original.teamBId !== m.teamBId)) {
          batch.update(doc(db, 'matches', m.id), {
            teamAId: m.teamAId || null,
            teamBId: m.teamBId || null
          });
          count++;
        }
      }
      if (count > 0) {
        await batch.commit();
        alert(`${count} confrontos do mata-mata atualizados automaticamente no Firestore! ✓`);
        fetchMatches();
      } else {
        alert("Todos os confrontos já estão perfeitamente atualizados com base nos grupos.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar confrontos automatizados no Firestore.");
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
      
      await recalculateAllScores(true); // Chamada automática e silenciosa
      alert('Resultado salvo e ranking atualizado com sucesso!');
      fetchMatches();
    } catch(e) {
      console.error(e);
      alert('Erro ao salvar resultado.');
    }
  };

  const recalculateAllScores = async (isAuto = false) => {
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
            if (pred.scoreA === undefined || pred.scoreB === undefined || pred.scoreA === '' || pred.scoreB === '') continue; // Ignora palpite inválido

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

      const isTournamentFinished = !!championId;
      
      const batch = writeBatch(db);
      for (const u of usersData) {
        let finalPoints = u.basePoints;
        
        // Bônus de Maior Acertador de Exatos (SOMENTE NO FINAL DO TORNEIO)
        if (isTournamentFinished && maxExactScores > 0 && u.baseExact === maxExactScores) {
          finalPoints += 10;
        }
        
        // Bônus de Campeão
        if (isTournamentFinished && u.championTeamId === championId) {
          finalPoints += 10;
        }

        batch.update(doc(db, 'users', u.id), {
          points: finalPoints,
          exactScores: u.baseExact
        });
      }

      await batch.commit();
      
      if (!isAuto) {
        alert('Pontuações recalculadas com sucesso! Todos os bônus foram aplicados.');
      }
      
      fetchUsers(); // Atualiza a tela se necessário
    } catch (e) {
      console.error(e);
      if (!isAuto) alert('Erro ao recalcular pontuações.');
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '10px', flexWrap: 'wrap' }}>
            <h3>Resultados Oficiais</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button onClick={handleAutoResolveKnockouts} style={{ background: 'var(--primary)', color: '#000', border: 'none', fontWeight: 600 }}>
                ⚡ Auto-Preencher Mata-Mata
              </Button>
              <Button onClick={() => recalculateAllScores(false)} style={{ background: 'var(--success)', color: '#fff', border: 'none' }}>
                🔄 Recalcular Pontos
              </Button>
            </div>
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
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setTeamA(m.teamAId || '');
    setTeamB(m.teamBId || '');
  }, [m.teamAId, m.teamBId]);

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
    setIsEditing(false);
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
      {!m.teamAId || !m.teamBId || isEditing ? (
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
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button onClick={handleSaveTeams} disabled={saving} style={{flex: 1, padding:'8px', fontSize:'13px'}}>
              {saving ? 'Salvando...' : 'Salvar Times'}
            </Button>
            {m.teamAId && m.teamBId && (
              <Button variant="secondary" onClick={() => setIsEditing(false)} style={{flex: 1, padding:'8px', fontSize:'13px'}}>
                Cancelar
              </Button>
            )}
          </div>
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

          {!isFinished && (
            <div style={{ textAlign: 'center', marginTop: '4px' }}>
              <button 
                onClick={() => setIsEditing(true)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline' }}
              >
                ✏️ Editar Confronto
              </button>
            </div>
          )}

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
