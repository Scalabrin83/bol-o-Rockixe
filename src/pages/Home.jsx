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
  const [stats, setStats] = useState({ totalUsers: 0, totalPot: 0 });
  const [showConfirmedPopup, setShowConfirmedPopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Buscar times
      const teamsSnap = await getDocs(collection(db, 'teams'));
      const obj = {};
      teamsSnap.docs.forEach(d => { obj[d.id] = d.data(); });
      setTeams(obj);

      // Buscar total de pagantes
      const usersSnap = await getDocs(collection(db, 'users'));
      let confirmedCount = 0;
      usersSnap.docs.forEach(d => {
        if (d.data().status === 'confirmed') confirmedCount++;
      });
      setStats({
        totalUsers: confirmedCount,
        totalPot: confirmedCount * 50
      });
    };
    fetchData();
  }, []);

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
