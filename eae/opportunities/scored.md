# 📊 Oportunidades Pontuadas

> **Regra da IA:** Oportunidades do backlog avaliadas pelo `radar_mercado`.
> Score sugerido: **Impacto (1-5) × Confiança ÷ Esforço**, com nota de Risco.
> O `diretor_executivo` puxa daqui para o `roadmap` (promoção = gate). Nasce vazio.

## Pontuadas

| Oportunidade | Impacto | Esforço | Risco | Score | Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **opt_001: Feedback de Pontos e Destaque no Ranking** | 4 | 2 | Baixo | 2.0 | Aguardando Promoção |

### Detalhamento da Oportunidade: opt_001

*   **Problema:**
    1.  **Falta de feedback pós-jogo na aba Palpites:** Ao navegar por rodadas passadas, o participante vê seus palpites bloqueados, mas não consegue ver qual foi o resultado oficial do jogo nem quantos pontos aquela aposta específica lhe rendeu, a menos que procure na classificação.
    2.  **Dificuldade de localização no Ranking:** Em rankings com muitos usuários, o participante precisa rolar a página e procurar pelo seu nome manualmente.
*   **Solução Proposta:**
    1.  **Exibição de Resultados e Pontos:** Nos cards de partidas finalizadas (`match.status === 'finished'`) da aba *Palpites*, exibir o resultado oficial em verde/dourado e o ganho exato de pontos obtido por aquele palpite (ex: `🔥 Placar Exato (+6 pts)` ou `👍 Vencedor/Empate (+3 pts)` ou `❌ Errou (+0 pts)`).
    2.  **Destaque no Ranking:** Na lista de classificação, destacar visualmente a linha correspondente ao participante logado (`user.uid === currentUser.uid`) usando uma cor de fundo sutil ou borda brilhante dourada (`var(--primary)` com opacidade).
*   **Valor para o Usuário:** Melhora a usabilidade de forma imediata, gera engajamento (o usuário pode ver de forma didática onde ganhou ou perdeu pontos) e torna o acompanhamento do ranking muito mais ágil no celular.
*   **Plano de Riscos:** Risco de regressão nulo. As mudanças são puramente visuais no frontend (`Palpites.jsx` e `Ranking.jsx`) e utilizam dados que já são baixados no carregamento inicial da página. Nenhuma escrita ou mudança de esquema é feita no banco de dados.
