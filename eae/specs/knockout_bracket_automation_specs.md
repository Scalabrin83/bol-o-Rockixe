# Especificação Técnica: Automação e Edição Manual do Mata-Mata + Auditoria de Palpites

> Gerado na Fase 2. Todas as seções abaixo são **obrigatórias**.

## 1. Modo
- [x] Evolução (módulo existente)
- Módulo(s) afetado(s): `Admin`, `Palpites`

## 2. Visão Geral
Esta evolução tem dois objetivos principais:
1. **Auditoria e Correção de Palpites**: Garantir que as regras de palpites de mata-mata criadas pelo usuário (empate exige vencedor nos pênaltis) sejam preservadas. Corrigir um bug crítico onde a escolha do participante para `penaltyWinnerId` no palpite de empate não era persistida no Firestore.
2. **Automação & Edição Manual do Mata-Mata**: Introduzir um mecanismo automático no painel do administrador para preencher os times do mata-mata (iniciando em 32-avos de final) a partir dos resultados dos grupos (com os 2 melhores de cada e os 8 melhores 3ºs colocados), permitindo, adicionalmente, habilitar dropdowns para alteração manual/manual override das equipes se o administrador julgar necessário.

## 3. Fronteira do Módulo & API Pública
Nenhuma nova API pública é criada. O componente React `Admin.jsx` gerencia localmente as operações e atualiza a coleção `/matches` no Firestore. O componente `Palpites.jsx` atualiza `/predictions` incluindo o campo `penaltyWinnerId` ao salvar o palpite.

## 4. Modelo de Dados
- Coleção `/predictions/{userId}`: O mapa de partidas no campo `matches` deve salvar a chave `penaltyWinnerId` (string) quando o placar predito for empate.
- Coleção `/matches/{matchId}`: Recebe os campos `teamAId` e `teamBId` atualizados via Admin.

## 4b. Invariantes
- A regra de cálculo de pontos deve permanecer inalterada: Placar Exato = 6 pontos, Vencedor/Empate correto = 3 pontos, Classificado correto = 3 pontos.
- O palpite de empate no mata-mata deve obrigatoriamente exigir que o usuário selecione quem avança nos pênaltis antes de permitir o salvamento.

## 5. Direção de Dependência
- Depende de: `db` (Firebase Firestore) e dados carregados de `/teams` e `/matches`.

## 6. Plano de Testes
- **Salvar Palpite Mata-Mata**:
  - Testar no formulário de palpites o preenchimento de placar de empate (ex: 1x1) em partida de mata-mata. Confirmar que o botão de salvar fica desabilitado até selecionar a equipe que avança.
  - Ao salvar, confirmar no Firestore que o campo `penaltyWinnerId` é salvo no objeto da partida dentro do documento do usuário.
- **Automação de Chaveamento**:
  - Executar a função de auto-resolução no Admin.
  - Verificar se as partidas de 32-avos (`m073` a `m088`) são preenchidas corretamente baseadas nos vencedores, segundos e melhores terceiros colocados dos grupos.
  - Verificar se a alteração de vencedor em rodadas anteriores propaga automaticamente para as fases seguintes.
- **Edição Manual**:
  - No painel admin, acionar o botão de edição manual de times de uma partida já definida do mata-mata.
  - Alterar as seleções e salvar. Confirmar que os novos times são persistidos no Firestore.

## 7. Critérios de Aceite
- [ ] No mata-mata, o campo `penaltyWinnerId` é gravado no banco de dados ao salvar palpites de empate.
- [ ] No painel admin, as partidas já definidas do mata-mata passam a exibir um botão para "Editar Times", permitindo abrir os seletores de seleções.
- [ ] Implementação do botão "Auto-Preencher Mata-Mata" no Admin, calculando:
  - Classificação de todos os grupos.
  - Tabela dos 12 terceiros colocados (ordenada por pts, SG, GP).
  - Distribuição das 24 equipes (1ºs e 2ºs) e dos 8 melhores terceiros de acordo com as regras de chaveamento da Copa 2026.
  - Atualização recursiva de rodadas subsequentes (oitavas, quartas, semis, final) caso jogos anteriores estejam definidos e encerrados.
