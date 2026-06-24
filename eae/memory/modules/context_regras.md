# Contexto do Módulo: Regras (Rules)

## 1. Identidade
- **Caminho do código:** `src/pages/Regras.jsx`
- **Dono:** Interface (Pages)
- **Responsabilidade (uma frase):** Apresenta o regulamento estático, sistema de pontuação, custos de inscrição e critérios de premiação do bolão.

## 2. Responsabilidade & Fronteira
- **Faz:**
  - Explica detalhadamente as regras de acertos e pontuação para a fase de grupos.
  - Explica as regras detalhadas para a fase eliminatória (knockout/mata-mata):
    - Acerto de placar exato do jogo: 6 pontos.
    - Acerto de vencedor ou empate (errando placar): 3 pontos.
    - Acerto de quem se classifica nos pênaltis em caso de empate: +3 pontos (totalizando até 9 pontos por jogo).
  - Mostra os valores da taxa de participação e distribuição do prêmio acumulado (70%, 20% e 10% para os três primeiros).
- **NÃO faz:**
  - Não faz lógica de cálculo de pontos.
  - Não armazena dados de usuários.

## 3. API Pública (contrato)
Componente React puro exposto como rota principal `/regras`.

## 4. Invariantes
- As regras exibidas devem ser 100% fiéis às fórmulas matemáticas executadas pelo backend e pelo painel administrativo ao calcular o ranking.

## 5. Modelo de Dados / Entidades que possui
- N/A.

## 6. Fluxos de que participa
- **Onboarding e Esclarecimento:** Auxilia o participante a entender o funcionamento do jogo.

## 7. Dependências (saída)
- N/A (Arquivo contendo HTML/JSX estático).

## 8. Erros & Casos de Borda
- N/A.

## 9. Permissões / Acesso
- Acesso público a qualquer usuário logado.

## 10. Testes
- N/A.
