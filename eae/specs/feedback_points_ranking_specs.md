# Especificação Técnica: Feedback de Pontos e Destaque no Ranking (opt_001)

## 1. Modo
- [x] Evolução (módulo existente)
- Módulos afetados: `Palpites.jsx`, `Ranking.jsx`, `index.css`

## 2. Visão Geral
Adicionar suporte visual na aba de palpites para exibir o resultado oficial e a pontuação obtida por jogo finalizado. Além disso, destacar visualmente a linha do participante logado na tabela de classificação geral e placares exatos.

## 3. Fronteira do Módulo & API Pública
Nenhuma nova API pública é criada. O comportamento interno das páginas de palpites e ranking é alterado para incorporar as exibições visuais.

## 4. Modelo de Dados
Nenhuma alteração de modelo de dados ou esquema de banco de dados. Utiliza os campos existentes em `/matches` (`officialScoreA`, `officialScoreB`, `officialPenaltyWinnerId`, `status`) e `/predictions` (`scoreA`, `scoreB`, `penaltyWinnerId`).

## 4b. Invariantes
- O cálculo de pontos exibido no frontend para cada jogo deve corresponder exatamente à lógica de pontuação executada no recálculo do ranking do administrador.
- O destaque no ranking só é aplicado ao participante autenticado correspondente ao `currentUser.uid`.

## 5. Direção de Dependência
- `Palpites.jsx` e `Ranking.jsx` continuam dependendo de `AuthContext` e `firebase`. Sem novos ciclos.

## 6. Plano de Testes
- Verificação visual dos cards de partidas finalizadas no simulador de rodadas passadas.
- Verificação visual da classificação geral identificando a linha do usuário logado em destaque.

## 7. Critérios de Aceite
- [ ] Cards de partidas com `status === 'finished'` na aba *Palpites* exibem o placar oficial.
- [ ] Cards de partidas finalizadas exibem o total de pontos ganhos por aquele jogo (+6, +3, +9, +0 etc.) com uma tag colorida indicativa (verde para acerto exato, amarelo/dourado para vencedor, cinza para erro).
- [ ] A linha correspondente ao usuário logado na aba *Ranking* exibe um fundo destacado (`rgba(212,168,67,0.1)`) ou borda brilhante distinta.

## 8. Riscos / Gates
- Nenhum risco. As alterações são 100% de leitura no frontend.
