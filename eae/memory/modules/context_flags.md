# Contexto do Módulo: Bandeiras (Flags Utility)

## 1. Identidade
- **Caminho do código:** `src/utils/flags.js`
- **Dono:** Core / Utilitários
- **Responsabilidade (uma frase):** Mapeia estaticamente identificadores de seleções para emojis representativos de suas respectivas bandeiras nacionais.

## 2. Responsabilidade & Fronteira
- **Faz:**
  - Exporta um objeto chave-valor estático (`TEAM_FLAGS`) onde as chaves são IDs de seleções e os valores são emojis de bandeiras (ex: `brasil: "🇧🇷"`).
- **NÃO faz:**
  - Não faz buscas no banco ou requisições HTTP.
  - Não armazena outros dados das equipes.

## 3. API Pública (contrato)
```javascript
export const TEAM_FLAGS // Objeto mapeador ex: { "brasil": "🇧🇷", "alemanha": "🇩🇪", ... }
```

## 4. Invariantes
- O mapeamento é imutável em tempo de execução.
- Novas seleções devem ser inseridas manualmente caso haja expansões ou alterações.

## 5. Modelo de Dados / Entidades que possui
- N/A.

## 6. Fluxos de que participa
- **Visualização de Jogos e Tabelas:** Consumido por `Home.jsx`, `Palpites.jsx`, `Ranking.jsx` e `Classificacao.jsx` para renderizar bandeiras ao lado dos nomes de seleções.

## 7. Dependências (saída)
- N/A (Módulo utilitário puro isolado).

## 8. Erros & Casos de Borda
- **Seleção Inexistente:** Se uma seleção não estiver mapeada, a interface exibirá uma bandeira branca genérica `🏳️` como fallback.

## 9. Permissões / Acesso
- Acesso de leitura livre em qualquer parte da aplicação.

## 10. Testes
- N/A.
