# Especificação Técnica: Correção de Fuso Horário de Partidas

> Gerado na Fase 2. Todas as seções abaixo são **obrigatórias**.

## 1. Modo
- [x] Evolução (módulo existente)
- Módulo(s) afetado(s): Banco de Dados (coleção `matches`)

## 2. Visão Geral
Esta evolução corrige o erro de fuso horário (+5 horas) em 14 partidas da 3ª rodada da fase de grupos que foram importadas/cadastradas incorretamente com o deslocamento da Europa Central (CEST, UTC+2) mascarado como offset de Brasília (-03:00). Isso fazia com que os jogos constassem no sistema 5 horas mais tarde do que o início real.

## 3. Fronteira do Módulo & API Pública
Script de uso interno do administrador (`scripts/update_kickoffs.js`) para atualizar pontualmente os horários na base do Firestore. Nenhuma alteração de código ou API pública é feita nos componentes React do frontend.

## 4. Modelo de Dados
Atualização do campo `kickoffLocal` (string no formato ISO 8601 com offset `-03:00`) nos documentos correspondentes da coleção `matches` no Firestore.

## 4b. Invariantes
- A alteração só afeta o campo `kickoffLocal`.
- As outras propriedades de cada partida (ex: `teamAId`, `teamBId`, `stadium`, `city`, `roundName`, `status`) devem permanecer inalteradas.

## 5. Direção de Dependência
O script de atualização depende de:
- `firebase/app` e `firebase/firestore` (para conectar e atualizar os dados).
- `.env` (para credenciais de conexão).

## 6. Plano de Testes
- **Unidade/Lógica**: O script imprimirá no console a lista de IDs de partidas e seus horários "antigos" vs "novos" para validação em dry-run antes da escrita real no banco.
- **Regressão**: Rodar o script `check_db_temp.js` após a gravação para confirmar se o banco de dados reflete exatamente a lista de horários oficiais de Brasília.

## 7. Critérios de Aceite
- [ ] As 14 partidas (`m035`, `m036`, `m053`, `m054`, `m047`, `m048`, `m041`, `m042`, `m071`, `m072`, `m065`, `m066`, `m059`, `m060`) têm seus horários ajustados em -5 horas.
- [ ] O fuso horário de todas se mantém como `-03:00`.
- [ ] O app continua a exibir os jogos agrupados corretamente nas rodadas correspondentes do frontend.

## 8. Riscos / Gates
- **Operação Destrutiva**: Há o risco de sobrescrever campos errados. Para mitigar, o script de atualização fará modificações direcionadas apenas nos IDs específicos e somente no campo `kickoffLocal`.
