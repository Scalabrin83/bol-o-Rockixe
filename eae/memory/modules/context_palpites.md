# Contexto do Módulo: Palpites (Predictions)

## 1. Identidade
- **Caminho do código:** `src/pages/Palpites.jsx`
- **Dono:** Interface (Pages)
- **Responsabilidade (uma frase):** Fornece o formulário e interface para o participante visualizar partidas por rodada e salvar seus palpites de placar.

## 2. Responsabilidade & Fronteira
- **Faz:**
  - Lista os jogos do campeonato agrupados por rodada selecionada.
  - Habilita inputs para digitação de palpites para jogos abertos.
  - Bloqueia inputs caso o horário de kickoff da partida já tenha passado ou o administrador tenha travado a rodada inteira.
  - No mata-mata, caso haja empate no palpite, exige que o participante selecione quem se classifica (vencedor nos pênaltis) antes de permitir salvar o palpite.
- **NÃO faz:**
  - Não faz o cálculo de pontuação dos palpites (feito no painel Admin ao salvar resultados).
  - Não edita os dados oficiais do jogo.

## 3. API Pública (contrato)
Componente React puro exposto como rota principal `/palpites`.

## 4. Invariantes
- Um palpite só pode ser salvo se ambos os placares (A e B) estiverem digitados.
- Se for mata-mata e o palpite for empate, a escolha de quem se classifica nos pênaltis é obrigatória.
- É impossível gravar palpites após o kickoff da partida (a validação ocorre no frontend e é protegida pelas regras do Firestore no backend).

## 5. Modelo de Dados / Entidades que possui
- Coleção `/predictions/{userId}`: Documento individual por usuário contendo um mapa de `matches` indexado por `matchId` com campos: `scoreA`, `scoreB`, `updatedAt`, e `penaltyWinnerId` (para mata-mata).

## 6. Fluxos de que participa
- **Registro de Palpite:** Grava os placares no documento de palpites do usuário.

## 7. Dependências (saída)
- `src/contexts/AuthContext.jsx` — Dados de pagamento e identificação do usuário.
- `src/utils/flags.js` — Bandeiras das seleções.

## 8. Erros & Casos de Borda
- **Input de Letras:** O formulário impede e filtra a digitação de caracteres não numéricos.
- **Mata-mata Empatado:** Exibe dinamicamente o painel de decisão dos pênaltis.

## 9. Permissões / Acesso
- O participante possui permissão de escrita apenas em seu próprio documento de palpites (`predictions/{currentUser.uid}`).

## 10. Testes
- N/A (Testado e validado em produção).
