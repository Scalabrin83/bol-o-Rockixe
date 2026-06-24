# Contexto do Módulo: Classificação (Groups Standings)

## 1. Identidade
- **Caminho do código:** `src/pages/Classificacao.jsx`
- **Dono:** Interface (Pages)
- **Responsabilidade (uma frase):** Exibe a classificação oficial e em tempo real de cada um dos grupos da Copa do Mundo de 2026.

## 2. Responsabilidade & Fronteira
- **Faz:**
  - Apresenta as tabelas de classificação dos grupos (A a L) calculando pontos, vitórias, saldo de gols e gols marcados com base nos resultados das partidas salvas.
  - Oferece um seletor visual em formato de abas para navegar entre os grupos.
  - Destaca visualmente com cores específicas as seleções que estão nas posições de classificação direta (1º e 2º) e melhores terceiros colocados.
- **NÃO faz:**
  - Não faz alteração em tabelas ou resultados de jogos.
  - Não decide quem avança no chaveamento (o cálculo da tabela é automático e funcional).

## 3. API Pública (contrato)
Componente React puro exposto como rota principal `/classificacao`.

## 4. Invariantes
- A tabela é gerada dinamicamente cruzando os dados das seleções com os placares oficiais dos jogos finalizados (`status === 'finished'`).

## 5. Modelo de Dados / Entidades que possui
- N/A (Lê de `/matches` e `/teams`).

## 6. Fluxos de que participa
- **Consulta de Tabela:** Exibe a situação do torneio oficial para os competidores.

## 7. Dependências (saída)
- `src/lib/firebase.js` — Conexão com Firestore.

## 8. Erros & Casos de Borda
- **Jogos Não Disputados:** Exibe todas as seleções com zero pontos, vitórias e saldo antes do início das partidas.

## 9. Permissões / Acesso
- Apenas leitura pública das informações dos grupos.

## 10. Testes
- N/A.
