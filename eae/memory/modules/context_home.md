# Contexto do Módulo: Home (Dashboard)

## 1. Identidade
- **Caminho do código:** `src/pages/Home.jsx`
- **Dono:** Interface (Pages)
- **Responsabilidade (uma frase):** Centraliza as informações principais do bolão para os participantes, como pontuação, ranking pessoal, status de pagamento, premiação e jogos em tempo real.

## 2. Responsabilidade & Fronteira
- **Faz:**
  - Exibe o status da conta do usuário (se estiver `pending`, mostra chave PIX para pagamento).
  - Calcula e apresenta a premiação total acumulada com base no número de pagantes confirmados.
  - Exibe os pontos acumulados e placares exatos acertados pelo usuário.
  - Renderiza o card e modal de **"Palpites em Tempo Real"** para visualização das apostas de outros participantes para os jogos bloqueados mais recentes.
- **NÃO faz:**
  - Não permite salvar palpites (redireciona para a aba Palpites).
  - Não faz alteração direta de dados no banco (apenas lê informações gerais).

## 3. API Pública (contrato)
Componente React puro exposto como rota principal `/`.

## 4. Invariantes
- Apenas usuários com status `confirmed` podem ver seus pontos, premiação real e palpites em tempo real.
- O card de palpites em tempo real exibe apenas partidas cujo horário de início já passou (kickoffLocal no passado).

## 5. Modelo de Dados / Entidades que possui
- N/A (Consome dados de `users`, `matches`, `rounds` e `predictions`).

## 6. Fluxos de que participa
- **Visualização de Palpites Fechados:** Consulta a coleção de `predictions` sob demanda para exibir os palpites dos outros participantes no jogo atual.
- **Onboarding/PIX:** Exibe instruções de pagamento caso o usuário seja novo e esteja pendente.

## 7. Dependências (saída)
- `src/contexts/AuthContext.jsx` — Obtenção do estado do usuário.
- `src/utils/flags.js` — Bandeiras das seleções.

## 8. Erros & Casos de Borda
- **Erro de Conexão com Firebase:** Exibe logs de erro em caso de falha de conexão.
- **Sem Jogos Iniciados:** O card de palpites em tempo real permanece oculto até o primeiro jogo do campeonato começar.

## 9. Permissões / Acesso
- Apenas leitura de informações. O modal busca dados de palpites que já são públicos (jogos iniciados).

## 10. Testes
- N/A (Verificado manualmente em produção).
