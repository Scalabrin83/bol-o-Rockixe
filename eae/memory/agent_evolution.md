# 🧬 Evolução dos Agentes (versões + histórico)

> **Regra da IA:** Fonte única das versões dos prompts dos agentes. O
> `otimizador_de_agentes` atualiza aqui na Fase 6, toda vez que melhora um agente.
> Sem versão por arquivo (evita duplicação): a verdade está nesta tabela.

## Versões atuais
| Agente | Versão | Última mudança | Data |
|--------|--------|----------------|------|
| diretor_executivo | 1.0 | inicial | — |
| radar_mercado | 1.0 | inicial | — |
| engenharia_agentica | 1.1 | regra "MVP de página única autossuficiente (CSS/JS inline)" | 2026-06-20 |
| designer_ux | 1.2 | regra "refino visual é baseline, não formulário cru" | 2026-06-20 |
| auditor_acessibilidade | 1.0 | inicial (base wshobson) | — |
| guardiao_regressao | 1.0 | inicial | — |
| supervisor | 1.0 | inicial | — |
| memoria_organizacional | 1.0 | inicial | — |
| biblioteca_conhecimento | 1.0 | inicial | — |
| otimizador_de_agentes | 1.0 | inicial | — |
| cartografo_legado | 1.0 | inicial (modo brownfield) | 2026-06-20 |

## Histórico de melhorias

### designer_ux v1.0 → v1.1 — 2026-06-20
- **Ciclo/MVP:** Calculadora de preço para autônomos.
- **Sinal:** O MVP só ficou "aceitável" quando passou a exibir a *memória de cálculo* ("como chegamos nesse número"). Isso foi feito por julgamento, não por exigência de nenhum agente.
- **Diagnóstico:** O `designer_ux` não tinha regra para telas que produzem um valor calculado — risco de futuros MVPs entregarem só "o número".
- **Patch:** Regra nova: resultado calculado sempre acompanha explicação/memória de cálculo; vira critério de aceite na Fase 1.
- **Tipo:** Clareza/checklist (auto-aplicável).
- **Resultado esperado:** Próximos MVPs de cálculo (preço, total, prazo, score) já nascem explicando o resultado — mais prontos e confiáveis.

### designer_ux v1.1 → v1.2 — 2026-06-20
- **Ciclo/MVP:** Calculadora de preço para autônomos.
- **Sinal:** Feedback direto do usuário — "está horrível aqui do lado". A primeira versão da UI, embora funcional e acessível, tinha aparência de formulário cru/amador.
- **Diagnóstico:** O `designer_ux` garantia acessibilidade e estados, mas não exigia um **baseline de refino visual** — então a UI passava no QA técnico parecendo inacabada.
- **Patch:** Regra nova: toda UI nasce com hierarquia tipográfica, respiro, agrupamento, adornos (R$/%), destaque do resultado e hover/focus polidos. "Acessível ≠ feio."
- **Tipo:** Clareza/checklist (auto-aplicável).
- **Resultado esperado:** Próximos MVPs já saem com visual confiável de primeira, sem precisar de retrabalho após reclamação.

### engenharia_agentica v1.0 → v1.1 — 2026-06-20
- **Ciclo/MVP:** Calculadora de preço para autônomos.
- **Sinal:** Usuário relatou que a tela "volta a ficar feia e sem formatação" após updates. Diagnóstico mostrou o CSS correto e aplicado via servidor, mas o painel de preview abria o `index.html` direto (sem servir o `styles.css` externo) → página crua.
- **Diagnóstico:** Entrega dependia de asset externo que nem sempre resolve conforme a forma de abertura. Não era falha de design (o `designer_ux` estava correto), e sim de robustez de entrega.
- **Patch:** Regra nova: MVP de página única é entregue autossuficiente (CSS/JS críticos inline), validado tanto servido quanto via `file://`.
- **Tipo:** Clareza/checklist (auto-aplicável).
- **Resultado esperado:** MVPs aparecem estilizados em qualquer visualizador, eliminando o falso "está feio".
