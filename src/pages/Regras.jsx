import React from 'react';

export function Regras() {
  return (
    <div className="animate-in" style={{ paddingBottom: '40px' }}>
      <h2 className="section-title">Regras do <span>Bolão</span></h2>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ color: 'var(--primary)', marginBottom: '10px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>💰</span> Inscrição e Liberação
        </h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
          A participação no bolão é confirmada mediante o pagamento da taxa de <strong>R$ 50,00</strong>.<br/><br/>
          O pagamento deve ser feito via PIX e o comprovante enviado pelo WhatsApp ao administrador. A liberação para inserir seus palpites ocorre <strong>somente após a conferência e confirmação</strong> do pagamento pelo sistema.
        </p>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ color: 'var(--primary)', marginBottom: '10px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>⏱️</span> Como Funcionam os Palpites
        </h3>
        <ul style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '20px', margin: 0 }}>
          <li style={{ marginBottom: '8px' }}>Você pode inserir ou alterar o seu palpite até o <strong>minuto exato de início de cada jogo</strong>.</li>
          <li style={{ marginBottom: '8px' }}>O administrador também pode liberar ou trancar rodadas manualmente, dependendo do andamento do bolão.</li>
          <li><strong>Atenção:</strong> Palpites em branco não contam como "zero a zero" (empate). Um jogo sem palpite simplesmente <strong>não pontua</strong>. Para apostar no empate, você deve preencher os campos com números (ex: 0 x 0).</li>
        </ul>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ color: 'var(--primary)', marginBottom: '10px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🎯</span> Sistema de Pontuação
        </h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '10px' }}>
          A pontuação muda dependendo da fase do torneio.
        </p>
        
        <h4 style={{ fontSize: '15px', color: '#fff', marginTop: '15px', marginBottom: '5px' }}>Fase Classificatória (Grupos)</h4>
        <ul style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '20px', margin: 0 }}>
          <li style={{ marginBottom: '4px' }}>Acerto de <strong>Placar Exato</strong>: 6 pontos</li>
          <li>Acerto de <strong>Vencedor/Empate</strong> (sem placar exato): 3 pontos</li>
        </ul>

        <h4 style={{ fontSize: '15px', color: '#fff', marginTop: '15px', marginBottom: '5px' }}>Fase Eliminatória (Mata-mata)</h4>
        <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '5px' }}>
          No mata-mata a pontuação é dividida em duas partes: o resultado dos 90 minutos (ou prorrogação) e o time que avançar de fase.
        </p>
        <ul style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '20px', margin: 0 }}>
          <li style={{ marginBottom: '4px' }}>Acerto do <strong>Placar Exato</strong> (90 min/prorrogação): 6 pontos</li>
          <li style={{ marginBottom: '4px' }}>Acerto apenas do <strong>Vencedor/Empate</strong>: 3 pontos</li>
          <li>Acerto de <strong>Quem avança de fase (Quem passa)</strong>: +3 pontos bônus</li>
        </ul>
        <div style={{ background: 'var(--bg-dark)', padding: '10px', borderRadius: '8px', marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <em>Exemplo:</em> Se você apostar que dá Empate, o sistema pedirá para você escolher quem passa nos pênaltis. Se você acertar o placar do empate (6pts) e quem passou nos pênaltis (+3pts), você leva os 9 pontos cheios.
        </div>

        <h4 style={{ fontSize: '15px', color: '#fff', marginTop: '15px', marginBottom: '5px' }}>Bônus Especiais</h4>
        <ul style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)', paddingLeft: '20px', margin: 0 }}>
          <li style={{ marginBottom: '8px' }}>O palpite do <strong>Time Campeão</strong> (definido no momento do seu cadastro) renderá um bônus de <strong>10 pontos extras</strong> no final do campeonato caso você acerte!</li>
          <li>O participante que terminar o bolão com o <strong>maior número de Placares Exatos</strong> ganhará mais <strong>10 pontos extras</strong> na contagem final!</li>
        </ul>
      </div>

      <div className="card" style={{ marginBottom: '20px', borderColor: 'rgba(212,168,67,0.3)' }}>
        <h3 style={{ color: 'var(--primary)', marginBottom: '10px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🏆</span> Divisão da Premiação
        </h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '10px' }}>
          O valor total arrecadado com as inscrições será dividido entre os três primeiros colocados do Ranking Geral, da seguinte forma:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
          <div style={{ background: 'var(--bg-dark)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid var(--primary)', display: 'flex', justifyContent: 'space-between' }}>
            <strong style={{ color: '#fff' }}>🥇 1º Colocado</strong>
            <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>70% do pote</span>
          </div>
          <div style={{ background: 'var(--bg-dark)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #C0C0C0', display: 'flex', justifyContent: 'space-between' }}>
            <strong style={{ color: '#fff' }}>🥈 2º Colocado</strong>
            <span style={{ color: '#C0C0C0', fontWeight: 'bold' }}>20% do pote</span>
          </div>
          <div style={{ background: 'var(--bg-dark)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #CD7F32', display: 'flex', justifyContent: 'space-between' }}>
            <strong style={{ color: '#fff' }}>🥉 3º Colocado</strong>
            <span style={{ color: '#CD7F32', fontWeight: 'bold' }}>10% do pote</span>
          </div>
        </div>
      </div>
    </div>
  );
}
