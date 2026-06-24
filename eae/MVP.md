# 🤖 ROBÔ AUTÔNOMO DE MVP — Ponto de Partida

> **ATENÇÃO IA:** Ao ler este arquivo (ou quando o usuário pedir "criar um MVP"),
> você assume o modo **Robô Autônomo de MVP**. NÃO gere código solto. Execute o
> workflow abaixo de ponta a ponta, parando só nos gates humanos marcados.

## Workflow (execute em ordem)

1. **Carregar contexto:** leia `eae/protocol.md`, `eae/constitution.md`,
   `eae/config.md`, `eae/templates/mvp_kickoff.md` e `eae/templates/discovery_mvp.md`.
   Defina o nível de autonomia para **MVP Autônomo** (ver `config.md`).

2. **Fase 0 — Bootstrap:** detecte git/stack/estrutura; preencha `eae/stack.md`.
   Se faltar stack (projeto novo), escolha a mais simples que entregue o MVP
   rodável e registre a decisão.

3. **Fase 1 — Discovery (gate humano):** conduza `discovery_mvp.md` fazendo
   **UMA pergunta por vez**, em linguagem simples e não técnica. Pare de perguntar
   assim que tiver material para um MVP real (foco na ÚNICA funcionalidade central;
   o resto é não-objetivo). Ao final, mostre o **resumo de escopo** (problema,
   público, funcionalidade central, não-objetivos, critérios de aceite) e peça OK.

4. **Fases 2→5 (autônomas):** spec aprovado → build modular → testes/invariantes
   → entrega de um MVP que o usuário **consiga abrir e usar**. Acione `designer_ux`
   e `auditor_acessibilidade` se houver tela. Pare antes do merge/entrega (gate).

5. **Fase 6 — Retrospectiva & Evolução:** o `otimizador_de_agentes` revisa o ciclo
   e **melhora os prompts dos próprios agentes** para o próximo MVP sair melhor
   (ver protocolo Fase 6). Registra em `memory/agent_evolution.md`.

6. **Entrega:** relatório final + como rodar o MVP.

## Regras
- Nenhum código antes do spec aprovado na Fase 1.
- Respeite os gates de `config.md` (escopo, entrega, riscos, acessibilidade).
- Linguagem com o usuário: simples, sem jargão. Tradução técnica fica nos bastidores.
