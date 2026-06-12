import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Share2 } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { isAfter, parseISO } from 'date-fns';
import { TEAM_FLAGS } from '../utils/flags';

// Troque pela URL real após fazer o deploy na Hostinger
const APP_URL = 'https://bolao.barbeariarockixe.com.br';

export function Home() {
  const { userData } = useAuth();
  const [teams, setTeams] = useState({});
  const [stats, setStats] = useState({ totalUsers: 0, totalPot: 0 });
  const [showConfirmedPopup, setShowConfirmedPopup] = useState(false);
  const [activeMatches, setActiveMatches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMatch, setModalMatch] = useState(null);
  const [modalPredictions, setModalPredictions] = useState([]);
  const [loadingPredictions, setLoadingPredictions] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsSnap, usersSnap, matchesSnap, roundsSnap] = await Promise.all([
          getDocs(collection(db, 'teams')),
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'matches')),
          getDocs(collection(db, 'rounds'))
        ]);

        const obj = {};
        teamsSnap.docs.forEach(d => { obj[d.id] = d.data(); });
        setTeams(obj);

        const usersList = usersSnap.docs.map(d => ({ uid: d.id, ...d.data() }));
        let confirmedCount = 0;
        usersList.forEach(u => {
          if (u.status === 'confirmed') confirmedCount++;
        });
        setStats({
          totalUsers: confirmedCount,
          totalPot: confirmedCount * 50
        });

        const matchesData = matchesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const roundsData = roundsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        const locked = matchesData.filter(m => {
          const isLockedByTime = isAfter(new Date(), parseISO(m.kickoffLocal));
          const round = roundsData.find(r => r.id === m.roundId);
          const isLockedByRound = round?.predictionStatus === 'locked';
          return isLockedByTime || isLockedByRound;
        });

        if (locked.length > 0) {
          const maxKickoff = Math.max(...locked.map(m => new Date(m.kickoffLocal).getTime()));
          const active = locked.filter(m => new Date(m.kickoffLocal).getTime() === maxKickoff);
          setActiveMatches(active);
        }
      } catch (error) {
        console.error("Erro ao buscar dados na Home", error);
      }
    };
    fetchData();
  }, []);

  const handleOpenPredictions = async (match) => {
    setModalMatch(match);
    setShowModal(true);
    setLoadingPredictions(true);
    
    try {
      const [usersSnap, predictionsSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'predictions'))
      ]);
      
      const confirmedUsers = usersSnap.docs
        .map(d => ({ uid: d.id, ...d.data() }))
        .filter(u => u.status === 'confirmed' && (!u.isAdmin || u.championTeamId));
        
      const allPreds = {};
      predictionsSnap.docs.forEach(d => {
        allPreds[d.id] = d.data().matches || {};
      });
      
      const mapped = confirmedUsers.map(user => {
        const userPred = allPreds[user.uid]?.[match.id];
        const hasPrediction = userPred !== undefined && userPred.scoreA !== undefined && userPred.scoreB !== undefined;
        
        let penaltyWinnerName = null;
        if (hasPrediction && userPred.penaltyWinnerId) {
          penaltyWinnerName = teams[userPred.penaltyWinnerId]?.name || userPred.penaltyWinnerId;
        }
        
        return {
          userName: user.name,
          scoreA: userPred?.scoreA,
          scoreB: userPred?.scoreB,
          penaltyWinnerName,
          hasPrediction
        };
      });
      
      mapped.sort((a, b) => {
        if (a.hasPrediction !== b.hasPrediction) {
          return b.hasPrediction - a.hasPrediction;
        }
        return a.userName.localeCompare(b.userName);
      });
      
      setModalPredictions(mapped);
    } catch (error) {
      console.error("Erro ao buscar palpites", error);
      alert("Erro ao buscar palpites.");
    } finally {
      setLoadingPredictions(false);
    }
  };

  if (!userData) return null;

  const isPending = userData.status === 'pending';
  const championName = teams[userData.championTeamId]?.name || userData.championTeamId;

  useEffect(() => {
    if (!userData || userData.status !== 'confirmed') return;
    const storageKey = `bolao-confirmed-popup-${userData.uid}`;
    const alreadySeen = window.localStorage.getItem(storageKey);
    if (!alreadySeen) {
      setShowConfirmedPopup(true);
      window.localStorage.setItem(storageKey, 'true');
    }
  }, [userData]);

  const shareMessage = `⚽🏆 *Bolão Copa do Mundo 2026 - Barbearia Rockixe!*\n\nFala, craque! Participe do nosso bolão da Copa do Mundo 2026! Escolha seu campeão, faça seus palpites e concorra a prêmios!\n\n👉 Acesse e cadastre-se: ${APP_URL}\n\n_Vagas limitadas!_ 🔥`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Bolão Copa 2026 - Rockixe', text: shareMessage, url: APP_URL });
        return;
      } catch (e) { /* fallback */ }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank');
  };

  // Link do grupo do WhatsApp (visível para todos os usuários cadastrados)
  const groupLink = 'https://chat.whatsapp.com/JEVrj44xUlH19vp5VZr8en?mode=gi_t';

  // Componente do Bloco de Premiação
  const PrizePoolBlock = () => {
    const pot = stats.totalPot;
    const firstPrize = pot * 0.7;
    const secondPrize = pot * 0.2;
    const thirdPrize = pot * 0.1;

    return (
      <div className="card" style={{ marginBottom: 20, borderColor: 'rgba(212,168,67,0.3)', padding: '20px 15px' }}>
        <h3 style={{ color: 'var(--primary)', marginBottom: '15px', fontSize: '18px', textAlign: 'center', fontWeight: 800 }}>Premiação Atual</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', background: 'var(--bg-dark)', padding: '12px', borderRadius: '8px' }}>
          <div style={{ textAlign: 'center', flex: 1, borderRight: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Participantes</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>{stats.totalUsers}</div>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Arrecadação Total</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>R$ {pot},00</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ background: 'var(--bg-dark)', padding: '10px 15px', borderRadius: '8px', borderLeft: '4px solid var(--primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ color: '#fff', fontSize: '14px' }}>🥇 1º Colocado <span style={{fontSize:'11px', color:'var(--text-muted)'}}>(70%)</span></strong>
            <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '16px' }}>R$ {firstPrize.toFixed(2).replace('.', ',')}</span>
          </div>
          <div style={{ background: 'var(--bg-dark)', padding: '10px 15px', borderRadius: '8px', borderLeft: '4px solid #C0C0C0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ color: '#fff', fontSize: '14px' }}>🥈 2º Colocado <span style={{fontSize:'11px', color:'var(--text-muted)'}}>(20%)</span></strong>
            <span style={{ color: '#C0C0C0', fontWeight: 800, fontSize: '16px' }}>R$ {secondPrize.toFixed(2).replace('.', ',')}</span>
          </div>
          <div style={{ background: 'var(--bg-dark)', padding: '10px 15px', borderRadius: '8px', borderLeft: '4px solid #CD7F32', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ color: '#fff', fontSize: '14px' }}>🥉 3º Colocado <span style={{fontSize:'11px', color:'var(--text-muted)'}}>(10%)</span></strong>
            <span style={{ color: '#CD7F32', fontWeight: 800, fontSize: '16px' }}>R$ {thirdPrize.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
      </div>
    );
  };

  // Tela Exclusiva para Usuários Pendentes
  if (isPending) {
    const whatsAppMessage = encodeURIComponent(`Olá Renato, segue o comprovante do meu pagamento do bolão! Meu usuário é: ${userData.name}`);
    const whatsappLink = `https://wa.me/5511971927447?text=${whatsAppMessage}`;

    return (
      <div className="animate-in" style={{ textAlign: 'center' }}>
        <h2 className="section-title" style={{ marginBottom: 30 }}>
          Olá, <span>{userData.name}</span>!
        </h2>

        <div style={{ marginBottom: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 8 }}>
            Acesse o grupo do bolão no whats app
          </div>
          <a
            href={groupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--secondary"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 700 }}
          >
            GRUPO DO BOLÃO
          </a>
        </div>

        <div className="card card--gold" style={{ padding: '30px 20px', marginBottom: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 15 }}>⏳</div>
          <h3 style={{ color: 'var(--warning)', fontSize: 20, fontWeight: 800, marginBottom: 10 }}>Inscrição Pendente</h3>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: 25 }}>
            Para liberar seu acesso total e confirmar sua participação no bolão, realize o pagamento da taxa de inscrição.
          </p>

          <div style={{ background: 'var(--bg-dark)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(251,191,36,0.3)', marginBottom: 25 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>Valor da Inscrição</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--primary)', marginBottom: 20 }}>R$ 50,00</div>

            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>Chave PIX (E-mail)</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '6px', userSelect: 'all', wordBreak: 'break-all' }}>
              r_scalabrin@hotmail.com
            </div>
          </div>

          <PrizePoolBlock />

          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary" 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', fontSize: 15, padding: '14px', background: '#25D366', color: '#fff', border: 'none' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            Enviar Comprovante
          </a>
        </div>
      </div>
    );
  }

  // Tela Normal para Usuários Confirmados (Admin ou Aprovados)
  return (
    <div className="animate-in">
      <h2 className="section-title">
        Olá, <span>{userData.name}</span>!
      </h2>

      <div style={{ marginBottom: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 8 }}>
          Acesse o grupo do bolão no whats app
        </div>
        <a
          href={groupLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--secondary"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 700 }}
        >
          GRUPO DO BOLÃO
        </a>
      </div>

      {showConfirmedPopup && (
        <div className="card" style={{ borderColor: 'rgba(52,211,153,0.3)', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>✅</span>
              <h3 style={{ color: 'var(--success)', fontSize: 15, fontWeight: 700, margin: 0 }}>Inscrição Confirmada</h3>
            </div>
            <button
              onClick={() => setShowConfirmedPopup(false)}
              style={{ border: 'none', background: 'transparent', color: 'var(--text-secondary)', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}
              aria-label="Fechar notificação"
            >
              ×
            </button>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            Sua participação está confirmada! Boa sorte nos seus palpites. 🍀
          </p>
        </div>
      )}

      <PrizePoolBlock />

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-card__label">Pontos</div>
          <div className="stat-card__value">{userData.points || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Placares Exatos</div>
          <div className="stat-card__value">{userData.exactScores || 0}</div>
        </div>
      </div>

      {/* CARD PALPITES EM TEMPO REAL */}
      {activeMatches.length > 0 && (
        <div className="card" style={{ borderColor: 'var(--border-glow)', boxShadow: 'var(--shadow-glow)', marginBottom: 20, padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '16px' }}>⚽</span>
            <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Palpites em Tempo Real
            </span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeMatches.map(match => {
              const teamA = teams[match.teamAId];
              const teamB = teams[match.teamBId];
              return (
                <div key={match.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingRight: '8px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '15px' }}>{TEAM_FLAGS[match.teamAId] || '🏳️'}</span>
                      <span>{teamA?.name || '—'}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 500 }}>vs</span>
                      <span style={{ fontSize: '15px' }}>{TEAM_FLAGS[match.teamBId] || '🏳️'}</span>
                      <span>{teamB?.name || '—'}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {match.status === 'finished' ? '🏁 Finalizado' : '⏱️ Fechado / Em andamento'}
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenPredictions(match)}
                    className="btn btn--primary"
                    style={{ width: 'auto', padding: '8px 14px', fontSize: '12px', borderRadius: '8px', flexShrink: 0 }}
                  >
                    Ver Palpites
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {userData.championTeamId && (
        <div className="card card--gold" style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
            Meu Campeão
          </div>
          <div style={{ fontSize: 40, marginBottom: 4 }}>🏆</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>
            {championName}
          </div>
        </div>
      )}

      {/* Botão de convidar via WhatsApp */}
      {userData.isAdmin && (
        <button
          onClick={handleShare}
          className="btn btn--secondary"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%' }}
        >
          <Share2 size={18} />
          Convidar pelo WhatsApp
        </button>
      )}

      {/* MODAL DE PALPITES EM TEMPO REAL */}
      {showModal && modalMatch && (
        <div className="modal-overlay">
          <div className="modal-header">
            <h3 className="modal-title">Palpites da Galera</h3>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
          </div>
          
          <div className="modal-body">
            <div style={{ textAlign: 'center', marginBottom: '20px', padding: '15px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                Jogo Ativo
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '15px', fontWeight: 800 }}>
                <span>{TEAM_FLAGS[modalMatch.teamAId] || '🏳️'}</span>
                <span>{teams[modalMatch.teamAId]?.name}</span>
                <span style={{ color: 'var(--primary)', fontSize: '12px' }}>VS</span>
                <span>{teams[modalMatch.teamBId]?.name}</span>
                <span>{TEAM_FLAGS[modalMatch.teamBId] || '🏳️'}</span>
              </div>
              {modalMatch.status === 'finished' && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--success)', fontWeight: 600 }}>
                  Placar Oficial: {modalMatch.officialScoreA} × {modalMatch.officialScoreB}
                  {modalMatch.officialPenaltyWinnerId && ` (Pênaltis: ${teams[modalMatch.officialPenaltyWinnerId]?.name})`}
                </div>
              )}
            </div>

            {loadingPredictions ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                Carregando palpites...
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {modalPredictions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                    Nenhum participante confirmado encontrado.
                  </div>
                ) : (
                  modalPredictions.map((pred, i) => (
                    <div key={i} className="prediction-row">
                      <div className="prediction-row__user">
                        <span>{pred.userName}</span>
                        {pred.penaltyWinnerName && (
                          <span className="prediction-row__penalty-info">
                            🏆 Classifica: {pred.penaltyWinnerName}
                          </span>
                        )}
                      </div>
                      
                      {pred.hasPrediction ? (
                        <div className="prediction-row__score">
                          {pred.scoreA} × {pred.scoreB}
                        </div>
                      ) : (
                        <div className="prediction-row__no-pred">
                          Sem palpite ❌
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
