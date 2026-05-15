import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { isAfter, parseISO } from 'date-fns';

export function Palpites() {
  const { userData, currentUser } = useAuth();
  const [rounds, setRounds] = useState([]);
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState({});
  const [predictions, setPredictions] = useState({});
  const [selectedRound, setSelectedRound] = useState('round_g1');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roundsSnap, matchesSnap, teamsSnap, predsSnap] = await Promise.all([
          getDocs(collection(db, 'rounds')),
          getDocs(collection(db, 'matches')),
          getDocs(collection(db, 'teams')),
          getDoc(doc(db, 'predictions', currentUser.uid))
        ]);

        const roundsData = roundsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        roundsData.sort((a, b) => a.order - b.order);

        const matchesData = matchesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        matchesData.sort((a, b) => new Date(a.kickoffLocal) - new Date(b.kickoffLocal));

        const teamsObj = {};
        teamsSnap.docs.forEach(d => { teamsObj[d.id] = d.data(); });

        setRounds(roundsData);
        setMatches(matchesData);
        setTeams(teamsObj);

        if (predsSnap.exists()) {
          setPredictions(predsSnap.data().matches || {});
        }
      } catch (error) {
        console.error("Erro ao buscar dados", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);

  const handleScoreChange = (matchId, team, value) => {
    if (value !== '' && !/^\d+$/.test(value)) return;
    setPredictions(prev => ({ ...prev, [matchId]: { ...prev[matchId], [team]: value } }));
  };

  const handleSavePrediction = async (match) => {
    const round = rounds.find(r => r.id === match.roundId);
    const isLockedByTime = isAfter(new Date(), parseISO(match.kickoffLocal));
    const isLockedByRound = round?.predictionStatus === 'locked';
    if (isLockedByTime || isLockedByRound) {
      alert("Palpite bloqueado!");
      return;
    }

    const pred = predictions[match.id] || {};
    if (pred.scoreA === undefined || pred.scoreB === undefined || pred.scoreA === '' || pred.scoreB === '') {
      alert("Preencha o placar das duas equipes.");
      return;
    }

    setSaving(true);
    try {
      const predRef = doc(db, 'predictions', currentUser.uid);
      const docSnap = await getDoc(predRef);
      const newData = {
        ...((docSnap.exists() ? docSnap.data().matches : {}) || {}),
        [match.id]: {
          scoreA: parseInt(pred.scoreA, 10),
          scoreB: parseInt(pred.scoreB, 10),
          updatedAt: new Date().toISOString()
        }
      };
      await setDoc(predRef, { matches: newData }, { merge: true });
      alert("Palpite salvo! ✓");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 80, color: 'var(--text-muted)' }}>Carregando jogos...</div>;

  if (userData?.status === 'pending') {
    return (
      <div className="animate-in">
        <h2 className="section-title">Meus <span>Palpites</span></h2>
        <div className="card" style={{ borderColor: 'rgba(251,191,36,0.3)', textAlign: 'center', padding: '30px 20px', marginTop: '40px' }}>
          <div style={{ fontSize: 40, marginBottom: 15 }}>🔒</div>
          <h3 style={{ color: 'var(--warning)', fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Palpites Bloqueados</h3>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            Você precisa confirmar o pagamento da inscrição para começar a jogar.
            <br/><br/>
            Acesse a aba <strong style={{color: '#fff'}}>Início</strong> para ver a chave PIX e enviar o comprovante para o administrador.
          </p>
        </div>
      </div>
    );
  }

  const currentRound = rounds.find(r => r.id === selectedRound);
  const roundMatches = matches.filter(m => m.roundId === selectedRound);

  return (
    <div className="animate-in">
      <h2 className="section-title">Meus <span>Palpites</span></h2>

      {/* Round selector pills */}
      <div className="round-selector">
        {rounds.map(r => (
          <button
            key={r.id}
            className={`round-selector__btn ${selectedRound === r.id ? 'round-selector__btn--active' : ''}`}
            onClick={() => setSelectedRound(r.id)}
          >
            {r.name.replace('Fase de Grupos - ', '')}
          </button>
        ))}
      </div>

      {/* Round status */}
      {currentRound && (
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <span className={`status-badge ${currentRound.predictionStatus === 'open' ? 'status-badge--open' : 'status-badge--locked'}`}>
            {currentRound.predictionStatus === 'open' ? '🟢 Aberta para palpites' : '🔒 Rodada bloqueada'}
          </span>
        </div>
      )}

      {/* Matches */}
      {roundMatches.map(match => {
        const isLockedByTime = isAfter(new Date(), parseISO(match.kickoffLocal));
        const isLockedByRound = currentRound?.predictionStatus === 'locked';
        const isLocked = isLockedByTime || isLockedByRound;
        const pred = predictions[match.id] || {};
        const hasSaved = pred.scoreA !== undefined && pred.scoreB !== undefined && pred.scoreA !== '' && pred.scoreB !== '';
        const teamA = teams[match.teamAId];
        const teamB = teams[match.teamBId];

        if (!match.teamAId || !match.teamBId) return null; // Skip matches without teams

        const groupLabel = match.groupId ? match.groupId.replace('group_', 'Grupo ').toUpperCase() : match.roundName;

        return (
          <div key={match.id} className={`match-card ${isLocked ? 'match-card--locked' : ''} ${hasSaved ? 'match-card--saved' : ''}`}>
            <div className="match-card__header">
              <div className="match-card__group">{groupLabel}</div>
              <div className="match-card__time">
                {new Date(match.kickoffLocal).toLocaleString('pt-BR', { 
                  day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' 
                })}
              </div>
              <div className="match-card__stadium">{match.stadium}</div>
            </div>

            <div className="match-card__teams">
              <div className="match-card__team match-card__team--left">
                <div className="match-card__team-name">{teamA?.name || '—'}</div>
              </div>

              <div className="match-card__scores">
                <input
                  className="match-card__score-input"
                  type="tel" maxLength="2"
                  value={pred.scoreA ?? ''}
                  onChange={e => handleScoreChange(match.id, 'scoreA', e.target.value)}
                  disabled={isLocked}
                />
                <span className="match-card__vs">×</span>
                <input
                  className="match-card__score-input"
                  type="tel" maxLength="2"
                  value={pred.scoreB ?? ''}
                  onChange={e => handleScoreChange(match.id, 'scoreB', e.target.value)}
                  disabled={isLocked}
                />
              </div>

              <div className="match-card__team match-card__team--right">
                <div className="match-card__team-name">{teamB?.name || '—'}</div>
              </div>
            </div>

            <div className="match-card__action" style={{ textAlign: 'center' }}>
              {!isLocked && (
                <Button size="sm" onClick={() => handleSavePrediction(match)} disabled={saving}>
                  Salvar Palpite
                </Button>
              )}
              {isLocked && hasSaved && (
                <span className="match-card__badge match-card__badge--saved">✓ Palpite salvo</span>
              )}
              {isLocked && !hasSaved && (
                <span className="match-card__badge match-card__badge--locked">🔒 Bloqueado</span>
              )}
            </div>
          </div>
        );
      })}

      {roundMatches.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
          Nenhum jogo nesta rodada ainda.
        </div>
      )}
    </div>
  );
}
