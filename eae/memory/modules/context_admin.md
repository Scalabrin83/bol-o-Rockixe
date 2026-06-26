# Contexto do Módulo: Administração (Admin)

## 1. Identidade
- **Caminho do código:** `src/pages/Admin.jsx`
- **Dono:** Interface & Backoffice
- **Responsabilidade (uma frase):** Centraliza todos os controles administrativos do bolão, incluindo aprovação de participantes, controle de status das rodadas, digitação dos resultados oficiais das partidas e processamento em lote da pontuação do ranking.

## 2. Responsabilidade & Fronteira
- **Faz:**
  - Habilita e gerencia abas de controle administrativo: Usuários, Times, Jogos, Rodadas.
  - Permite alterar o status de pagamento de um usuário (pending -> confirmed) ou excluir participantes.
  - **Mata-Mata Automático:** Permite gerar automaticamente todos os confrontos do mata-mata (iniciando em 32-avos de final) a partir dos resultados da fase de grupos, selecionando os top 2 e os 8 melhores 3ºs colocados (usando busca backtracking para alocação sem conflito de grupos) e propagando em cascata as rodadas subsequentes de jogos finalizados.
  - **Override Manual:** Permite habilitar dropdowns para alteração manual de confrontos a qualquer momento (mesmo se já definidos) para corrigir distorções.
  - Permite trancar ou liberar rodadas inteiras para novos palpites.
  - Permite digitar o placar oficial de um jogo e salvá-lo.
  - **Recálculo Automático:** Ao salvar um resultado oficial, dispara a rotina idempotente `recalculateAllScores` que recalcula os pontos de todos os usuários do bolão a partir de todos os jogos finalizados, aplicando bônus e atualizando o ranking.
- **NÃO faz:**
  - Não altera palpites inseridos por participantes (apenas lê para cálculo de pontuação).

## 3. API Pública (contrato)
Componente React puro exposto como rota principal `/admin` protegida para usuários administradores.

## 4. Invariantes
- Apenas usuários cadastrados com `isAdmin: true` no banco podem carregar esta página.
- A rotina de recálculo é idempotente: reprocessar os pontos de um jogo ou recalcular todos os pontos não causa duplicações ou distorções.
- Resultados de mata-mata empatados no placar oficial exigem que o administrador selecione a equipe vencedora nos pênaltis antes de salvar.

## 5. Modelo de Dados / Entidades que possui
- N/A (Manipula diretamente `/users`, `/matches`, `/rounds`, `/teams` e `/predictions`).

## 6. Fluxos de que participa
- **Confirmação de Inscrição:** Altera o status do participante.
- **Encerramento de Partida:** Salva o placar final e atualiza os pontos de todos os competidores.

## 7. Dependências (saída)
- `src/contexts/AuthContext.jsx` — Obtenção dos dados do administrador.
- `src/lib/firebase.js` — Métodos de atualização e leitura de lote (Batch) do Firestore.

## 8. Erros & Casos de Borda
- **Recálculo Simultâneo:** O uso de transações/batchs impede problemas de concorrência se múltiplos administradores tentarem salvar resultados ao mesmo tempo.

## 9. Permissões / Acesso
- Altamente restrita: escrita e leitura geral permitida apenas se o usuário for administrador autenticado.

## 10. Testes
- N/A.
