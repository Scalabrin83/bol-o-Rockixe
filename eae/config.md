# ⚙️ CONFIG — Nível de Autonomia & Gates

> **Regra da IA:** Leia este arquivo na Fase 0. Ele define quanta autonomia você
> tem para transitar entre as fases sem pedir aprovação humana.

## Nível de autonomia atual
**SEMI-AUTÔNOMO** (padrão)

### O que cada nível significa
| Nível | Comportamento |
|-------|---------------|
| **Guiado** | Pede aprovação humana em **cada** transição de fase. |
| **Semi-autônomo** (padrão) | Para apenas em: (a) aprovação de escopo na **Fase 1**, (b) promoção de **oportunidade** (Fase R) para objetivo, (c) antes de **merge/entrega** na Fase 5, e (d) qualquer **gate de risco**. As Fases 2→3→4 correm sozinhas. |
| **Autônomo total** | Roda o loop inteiro a partir de um objetivo/spec, **inclusive promovendo oportunidades sozinho**, parando **somente** em gates de risco. |
| **MVP Autônomo** (preset) | Modo do `eae/MVP.md`: roda as Fases 0→6 sozinho, parando só em (a) aprovação de escopo na Fase 1, (b) antes da entrega, e (c) gates de risco. Pensado para entregar um MVP completo com mínimo de interrupção. |

Para mudar o nível, edite a linha "Nível de autonomia atual" acima.

## Gates de risco (sempre param, em QUALQUER nível)
A IA **deve** parar e pedir confirmação humana explícita antes de:
1. Quebrar a **API pública** de um módulo com dependentes.
2. Operações **destrutivas / irreversíveis** (apagar dados, migração sem volta, `reset --hard` que perca trabalho).
3. Adicionar uma **dependência externa** nova não prevista no spec.
4. Falha de QA persistente (após 2 tentativas de correção na Fase 4).
5. Qualquer ação que envie dados para fora (deploy, push para remoto público, chamadas externas) sem autorização prévia.
6. Promover uma **oportunidade** (Fase R) para objetivo de construção, salvo no nível Autônomo total.
7. Entregar UI com **barreira crítica de acessibilidade** apontada pelo `auditor_acessibilidade` sem remediar (ou sem decisão explícita registrada).
8. Patch do `otimizador_de_agentes` que mude **significativamente o comportamento** de um agente (Fase 6). Patches de clareza/checklist são auto-aplicáveis, mas **sempre** registrados em `memory/agent_evolution.md`.
