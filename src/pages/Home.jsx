import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Share2 } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Troque pela URL real após fazer o deploy na Hostinger
const APP_URL = 'https://bolao.barbeariarockixe.com.br';

export function Home() {
  const { userData } = useAuth();
  const [teams, setTeams] = useState({});

  useEffect(() => {
    const fetchTeams = async () => {
      const snap = await getDocs(collection(db, 'teams'));
      const obj = {};
      snap.docs.forEach(d => { obj[d.id] = d.data(); });
      setTeams(obj);
    };
    fetchTeams();
  }, []);

  if (!userData) return null;

  const isPending = userData.status === 'pending';
  const championName = teams[userData.championTeamId]?.name || userData.championTeamId;

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

  return (
    <div className="animate-in">
      <h2 className="section-title">
        Olá, <span>{userData.name}</span>!
      </h2>

      {isPending && (
        <div className="card" style={{ borderColor: 'rgba(251,191,36,0.3)', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>⏳</span>
            <h3 style={{ color: 'var(--warning)', fontSize: 15, fontWeight: 700 }}>Inscrição Pendente</h3>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            Sua inscrição no bolão está pendente de confirmação pelo administrador.
            Você já pode visualizar os jogos, mas seus palpites só valerão após a aprovação.
          </p>
        </div>
      )}

      {!isPending && (
        <div className="card" style={{ borderColor: 'rgba(52,211,153,0.3)', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <h3 style={{ color: 'var(--success)', fontSize: 15, fontWeight: 700 }}>Inscrição Confirmada</h3>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            Sua participação está confirmada! Boa sorte nos seus palpites. 🍀
          </p>
        </div>
      )}

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
    </div>
  );
}
