# Contexto do Módulo: Ranking

## 1. Identidade
- **Caminho do código:** `src/pages/Ranking.jsx`
- **Dono:** Interface (Pages)
- **Responsabilidade (uma frase):** Exibe a classificação geral dos participantes do bolão com base nos pontos e acertos de placar exato.

## 2. Responsabilidade & Fronteira
- **Faz:**
  - Lista todos os participantes confirmados.
  - Oferece duas abas de ordenação: Geral (ordenado por pontos totais e desempatado por placares exatos) e Placares Exatos (ordenado por número de acertos exatos e desempatado por pontos).
  - Destaca visualmente os três primeiros colocados com ícones/estilos de medalhas (1º, 2º e 3º).
  - Exibe a aposta de campeão de cada participante caso o torneio já tenha iniciado ou o prazo de apostas de campeão tenha expirado.
- **NÃO faz:**
  - Não faz alteração em pontos.
  - Não recalcula posições (apenas exibe dados lidos do banco).

## 3. API Pública (contrato)
Componente React puro exposto como rota principal `/ranking`.

## 4. Invariantes
- Apenas usuários com status `confirmed` e que não sejam administradores inativos participam do ranking.
- O critério de desempate segue estritamente a fórmula regulamentar.

## 5. Modelo de Dados / Entidades que possui
- N/A (Lê da coleção `/users` e `/teams`).

## 6. Fluxos de que participa
- **Visualização de Desempenho:** Permite que os competidores vejam suas colocações reais.

## 7. Dependências (saída)
- `src/lib/firebase.js` — Conexão com Firestore.

## 8. Erros & Casos de Borda
- **Sem Usuários Confirmados:** Exibe uma mensagem informando que não há competidores cadastrados e aprovados ainda.

## 9. Permissões / Acesso
- Apenas leitura pública das informações de ranking.

## 10. Testes
- N/A.
