import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [championTeamId, setChampionTeamId] = useState('');
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) navigate('/');
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!isLogin) {
      const fetchTeams = async () => {
        try {
          const snapshot = await getDocs(collection(db, 'teams'));
          const teamsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          teamsData.sort((a, b) => a.name.localeCompare(b.name));
          setTeams(teamsData);
        } catch (err) {
          console.error('Erro ao carregar seleções', err);
        }
      };
      fetchTeams();
    }
  }, [isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (phone.replace(/\D/g, '').length < 10) return setError('Digite um telefone válido com DDD');
    setLoading(true);
    try {
      if (isLogin) {
        await login(phone, password);
        navigate('/');
      } else {
        if (password !== confirmPassword) throw new Error('As senhas não coincidem');
        if (!name) throw new Error('O nome/apelido é obrigatório');
        if (!championTeamId) throw new Error('Você deve escolher uma seleção campeã');
        await register(phone, password, name, championTeamId);
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Hero section */}
      <div className="login-hero">
        <img src="/logo-rockixe.png" alt="Barbearia Rockixe" className="login-hero__logo" />
        <div className="login-hero__title">Bolão Copa 2026</div>
        <div className="login-hero__subtitle">Barbearia Rockixe</div>
      </div>

      {/* Form card */}
      <div className="login-card">
        <div className="login-card__header">
          <button 
            className={`login-card__tab ${isLogin ? 'login-card__tab--active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Entrar
          </button>
          <button 
            className={`login-card__tab ${!isLogin ? 'login-card__tab--active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Cadastrar
          </button>
        </div>

        {error && (
          <div className="login-card__error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-card__form">
          {!isLogin && (
            <div className="input-group">
              <label className="input-group__label">Nome ou Apelido</label>
              <input 
                className="input-group__field"
                placeholder="Como quer ser chamado?"
                value={name} onChange={e => setName(e.target.value)} required
              />
            </div>
          )}

          <div className="input-group">
            <label className="input-group__label">Telefone</label>
            <input 
              className="input-group__field"
              type="tel" placeholder="DDD + número (ex: 11999998888)"
              value={phone} onChange={e => setPhone(e.target.value)} required
            />
          </div>

          <div className="input-group">
            <label className="input-group__label">Senha</label>
            <input 
              className="input-group__field"
              type="password" placeholder="Sua senha"
              value={password} onChange={e => setPassword(e.target.value)} required
            />
          </div>

          {!isLogin && (
            <>
              <div className="input-group">
                <label className="input-group__label">Confirmar Senha</label>
                <input 
                  className="input-group__field"
                  type="password" placeholder="Repita sua senha"
                  value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                />
              </div>

              <div className="input-group">
                <label className="input-group__label">🏆 Palpite de Campeão (Obrigatório)</label>
                <select 
                  className="input-group__field"
                  value={championTeamId} onChange={e => setChampionTeamId(e.target.value)} required
                >
                  <option value="">Selecione uma seleção...</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                  ⚠️ Atenção: este palpite não poderá ser alterado. Vale +10 pontos!
                </span>
              </div>
            </>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? 'Aguarde...' : (isLogin ? 'Entrar' : 'Cadastrar e Salvar Palpite')}
          </Button>
        </form>
      </div>

      <div className="login-footer">
        Bolão recreativo entre amigos • Sem fins lucrativos
      </div>
    </div>
  );
}
