# 🔄 EAE — PROTOCOLO DA EMPRESA AGÊNTICA EVOLUTIVA

> **ATENÇÃO IA:** Quando você for instruída a rodar o "Agent Loop", você **DEVE**
> transitar pelas fases em ordem. Você **NUNCA** escreve código de produção
> antes de existir um spec aprovado (Fase 2). Este protocolo é agnóstico de
> projeto, linguagem e stack — você descobre o contexto em runtime, nunca o assume.

## Documentos que governam o loop
- `eae/constitution.md` — princípios inegociáveis de engenharia (ler em toda Fase 2).
- `eae/stack.md` — stack e convenções **deste** projeto (preencher na Fase 0).
- `eae/config.md` — nível de autonomia e gates de risco.
- `eae/agents/` — definição de cada papel agêntico (quem executa o quê).
- `eae/memory/` — arquitetura, módulos, decisões (ADRs), lições, e a **camada de produto** (`product_vision.md`, `roadmap.md`, `entities.md`, `workflows.md`, `permissions.md`, `business_rules.md`).
- `eae/knowledge/` — base de referência curada por tecnologia (`<tech>.md`).
- `eae/opportunities/` — pipeline de descoberta (`backlog.md`, `scored.md`, `rejected.md`).
- `eae/templates/` — modelos para spec, ADR, módulo, agente e oportunidade.

## Quem executa cada fase (papéis em `eae/agents/`)
| Papel | Atua em |
|-------|---------|
| **diretor_executivo** | Orquestra todo o loop; decide prioridade; aciona os demais |
| **radar_mercado** | Fase R (descoberta de oportunidades) |
| **engenharia_agentica** | Fases 2–3 (spec + construção) |
| **designer_ux** | Fases 1, 2 e 4 (UX, UI, design system, baseline de acessibilidade) |
| **auditor_acessibilidade** | Fases 1, 2 e 4 (alvo WCAG, auditoria e remediação) |
| **guardiao_regressao** | Fase 4 (testes de contrato e regressão) |
| **supervisor** | Valida gates de risco em qualquer fase |
| **memoria_organizacional** | Curadoria de `memory/` (Fase 5) |
| **biblioteca_conhecimento** | Curadoria de `knowledge/` (Fases 2 e 5) |
| **otimizador_de_agentes** | Fase 6 (evolui os prompts dos agentes) |
| **cartografo_legado** | Modo Brownfield (mapeia e modulariza sistema existente) |

Em projetos rodando no Claude Code, estes papéis podem ser spawnados como subagents.
Fora dele, a mesma IA assume o papel descrito no arquivo correspondente.

---

## Fase R: Radar (Descoberta de Oportunidades) — opcional / contínua
> Executor: **radar_mercado**. Roda quando o usuário pede ideias/evolução ou em modo Autônomo.
1. **Objetivo:** Descobrir o que vale a pena construir — não só executar pedidos.
2. **Ação:** Cruze `memory/product_vision.md` e `roadmap.md` com sinais (feedback, gaps, dívida técnica em `lessons_learned.md`). Adicione candidatas a `opportunities/backlog.md`, pontue em `opportunities/scored.md` (impacto × esforço × risco) e descarte com justificativa em `opportunities/rejected.md`.
3. **Transição (GATE):** Promover uma oportunidade pontuada para um objetivo de Fase 1 exige aprovação humana — **exceto** no nível Autônomo total (ver `config.md`).

## Fase 0: Bootstrap (O Cartógrafo)
1. **Objetivo:** Entender o terreno antes de qualquer coisa. Nunca assuma stack.
2. **Ação:**
   - Verifique se há repositório git. Se não houver e a Fase 3 for envolver código, proponha `git init`.
   - Detecte a stack lendo manifestos (`package.json`, `pyproject.toml`, `go.mod`, etc.) e a estrutura de pastas. Não invente — registre só o que observar.
   - Se a pasta `eae/` não existir no projeto-alvo, crie-a a partir deste framework.
   - Preencha/atualize `eae/stack.md`. Leia `eae/config.md` para saber o nível de autonomia.
3. **Transição:** Com o terreno mapeado, vá para a Fase 1.

## Fase 1: Discovery (O Arquiteto)
1. **Objetivo:** Entender a fundo a necessidade e alinhar escopo.
2. **Ação Prévia:** Leia a camada de produto em `memory/` (`product_vision.md`, `roadmap.md`, `business_rules.md`) para que o objetivo seja coerente com a estratégia.
3. **Ação:** Investigue até definir, sem ambiguidade: **problema**, **usuários**, **escopo** e **não-objetivos**, e **critérios de aceitação mensuráveis**. Faça **uma pergunta por vez**. Se a feature tem interface, acione o **designer_ux** para mapear fluxos de usuário e arquitetura de informação, e o **auditor_acessibilidade** para fixar o **nível de conformidade alvo** (ex: WCAG 2.2 AA) como critério de aceite.
4. **Transição:** **Gate humano** (ver `config.md`). Só avance quando o usuário aprovar o escopo.

## Fase 2: Specification & Memory (A Escrivã / engenharia_agentica)
1. **Objetivo:** Documentar a decisão técnica consultando o passado e os princípios.
2. **Ação Prévia (leitura obrigatória):** `constitution.md`, `stack.md`, `memory/architecture.md`, `memory/lessons_learned.md`, os `memory/modules/*.md` afetados (e seguir o ponteiro para o **`CONTEXT.md`** de cada módulo tocado ou dependente), e o `knowledge/<tech>.md` das tecnologias envolvidas. Consulte também `entities.md`, `workflows.md` e `permissions.md` se a mudança tocar dados, fluxos ou acesso.
3. **Decida o modo:**
   - **Criação** — feature/módulo novo → defina um novo contrato.
   - **Evolução** — mexer em módulo existente → leia seu contrato e seus **dependentes** antes. Quebrar a API pública é **gate de risco**: registre um ADR e decida entre versionar ou migrar os dependentes.
4. **Ação:** Crie `eae/specs/<feature>_specs.md` a partir de `templates/spec_template.md`: fronteira do módulo, **API pública**, modelo de dados, **direção de dependência**, plano de testes e critérios de aceite. Em features com UI, o **designer_ux** especifica componentes, estados, tokens e responsividade, estendendo `knowledge/design-system.md`.
5. **Transição:** Mostre o spec. Avance conforme o nível de autonomia do `config.md`.

## Fase 3: Development & Rollback (O Engenheiro / engenharia_agentica)
1. **Objetivo:** Escrever o código de forma segura e modular.
2. **Ação Prévia:** Garanta o rollback — branch por feature ou commit de segurança antes de começar.
3. **Ação:** Codifique **estritamente o que está no spec**. Respeite as fronteiras de módulo (só API pública dos outros — proibido "reach-in"). Sem dependências fora do spec. Commits pequenos e atômicos.
4. **Transição:** Código pronto → Fase 4.

## Fase 4: Testing & Quality (O QA / guardiao_regressao)
1. **Objetivo:** Provar que a Fase 3 atende ao spec e não quebrou o que existia.
2. **Ação:** Mínimo é build + lint + typecheck. Além disso: **testes de unidade** na lógica de domínio, **testes de contrato** na API pública (e dos dependentes, em Evolução), e verificação de **cada critério de aceite**. Em features com UI, o **designer_ux** revisa consistência visual e estados (hover/focus/erro/vazio), e o **auditor_acessibilidade** faz a **auditoria WCAG** no nível alvo e entrega plano de remediação — barreira crítica é gate de risco.
3. **Se der erro:** Corrija **até 2 vezes**. Se ainda falhar, rollback, registre em `memory/lessons_learned.md` e pare para o usuário (gate de risco).
4. **Transição:** Tudo passando → Fase 5.

## Fase 5: Delivery & Evolution (memoria_organizacional + biblioteca_conhecimento)
1. **Objetivo:** Encerrar o ciclo deixando o conhecimento atualizado.
2. **Ação:**
   - **Módulo novo → é OBRIGATÓRIO criar o `CONTEXT.md` co-localizado com o código** (via `templates/module_context_template.md`), com TODAS as seções preenchidas: responsabilidade, invariantes, fluxos, API pública, casos de borda, permissões e testes. Módulo existente → atualize o `CONTEXT.md` dele.
   - Crie/atualize o índice fino em `memory/modules/<modulo>.md` (ponteiro + dependentes) e o `memory/architecture.md`.
   - Atualize a camada de produto (`entities.md`, `workflows.md`, `permissions.md`, `roadmap.md`) se aplicável.
   - Decisão arquitetural relevante → **ADR** em `memory/decisions/`.
   - Aprendizado de tecnologia → enriqueça `knowledge/<tech>.md`. Armadilha → `memory/lessons_learned.md`.
   - (Opcional) Abra PR / atualize changelog.
3. **Entrega Final:** Relatório ao usuário e, se houver fila no `roadmap`/`opportunities`, volte à Fase R ou Fase 1 do próximo objetivo.

## Modo Brownfield — Auditoria de Modularização (cartografo_legado)
> Para pegar um sistema que **já existe** e modularizá-lo com segurança. Roda no
> lugar das Fases R/0/1 quando o objetivo é organizar um legado; depois a execução
> usa os ciclos de Evolução normais.
1. **Cartografia (cartografo_legado):** inventário → clustering em módulos candidatos → mapa de dependências com violações (ciclos, reach-in, god-modules). Produz `templates/modularization_audit.md`.
2. **Confirmar verdades (guardiao_regressao):** para cada comportamento crítico, escrever **teste de caracterização** (golden master) que trava o estado ATUAL. **Regra de ouro: não se refatora o que não está travado por teste.**
3. **Plano (engenharia_agentica + supervisor):** fronteiras-alvo + ordem segura (strangler), registrada em ADR. Mudança de fronteira pública é gate de risco.
4. **Execução:** cada módulo é extraído num **ciclo de Evolução** (Fases 2→5), com os testes de caracterização + de contrato sempre verdes — modulariza sem mudar comportamento.
5. **Encerramento:** Fase 6 evolui os agentes com o que se aprendeu no legado.

## Fase 6: Retrospectiva & Evolução dos Agentes (otimizador_de_agentes)
> Auto-aperfeiçoamento: faz o PRÓXIMO ciclo entregar algo melhor que este.
1. **Objetivo:** Transformar o atrito deste ciclo em melhoria permanente dos agentes.
2. **Ação:**
   - Reúna os sinais reais do ciclo: o que o usuário corrigiu, o que o QA pegou tarde, gates disparados, o que faltou para o MVP ficar "pronto/correto".
   - Para cada sinal, o `otimizador_de_agentes` faz **diagnóstico → patch dirigido** no `eae/agents/<agente>.md` responsável (mudança mínima: regra, checklist, exemplo).
   - Incrementa a versão em `memory/agent_evolution.md` e registra a melhoria (template `agent_improvement.md`).
3. **Gate:** patch de **clareza/checklist** é auto-aplicável; mudança de **comportamento** do agente é gate de risco (OK humano — ver `config.md`). Sem sinal real, não mexe.
4. **Transição:** Ciclo encerrado e sistema mais afiado para o próximo MVP.
