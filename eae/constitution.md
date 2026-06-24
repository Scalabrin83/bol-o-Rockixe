# ⚖️ PRINCÍPIOS DE ENGENHARIA (Inegociáveis)

> **Regra da IA:** Leia este arquivo em toda Fase 2. Nenhum spec ou código pode
> violar estes princípios. Eles são agnósticos de linguagem e stack — é o que
> garante que o software gerado seja modular, fácil de alterar, ampliar e escalar.

## 1. Modularidade por contrato
- Toda feature vive num **módulo** com uma **API pública explícita**. Tudo o mais é privado.
- Um módulo só fala com outro pela API pública dele — **nunca** acesse internals (proibido "reach-in").
- Todo módulo é apontado pelo índice fino em `memory/modules/<modulo>.md`.

## 2. Direção de dependência
- Dependências fluem numa direção só. Padrão sugerido: `features → core → infra`.
- **Proibido ciclo de dependência** entre módulos.
- Domínio/regra de negócio **não** depende de framework, UI ou I/O.

## 3. Alta coesão, baixo acoplamento
- Cada módulo tem uma responsabilidade clara.
- A lógica de domínio deve ser **testável sem subir o app** (sem rede, sem UI, sem banco real).
- Detalhes de infra (banco, HTTP, filesystem) ficam atrás de uma interface.

## 4. Mudança barata
- Prefira **composição** a herança.
- Unidades pequenas e nomes que **revelam intenção** (sem abreviações obscuras).
- Não duplique conhecimento (DRY), mas não abstraia cedo demais (regra de três).

## 5. Disciplina de dependências externas
- Não introduza biblioteca/pacote que não esteja declarado no spec aprovado.
- Prefira a biblioteca padrão e o que já existe no projeto antes de adicionar peso.

## 6. Segurança e dados por padrão
- Nunca logue segredos. Valide entradas nas fronteiras públicas.
- Operações destrutivas (apagar dados, migração irreversível) são **gate de risco** (ver config.md).

## 7. Testabilidade como requisito, não opcional
- Todo módulo com lógica não trivial nasce com testes (ver Fase 4).
- Um critério de aceite sem teste correspondente é considerado **não atendido**.

## 8. Acessibilidade e usabilidade são requisitos
- Toda interface nasce **acessível**: contraste adequado, navegação por teclado, foco visível, alvos de toque ≥ 44×44px, semântica para leitores de tela.
- Estados não-felizes (erro, vazio, carregando) são parte do design, não exceção.
- UI usa **design tokens centralizados** (`knowledge/design-system.md`) — sem valores mágicos espalhados.
- Acessibilidade/usabilidade entram como **critérios de aceite** e são verificadas na Fase 4 (dono: `designer_ux`).

## 9. Todo módulo se autodescreve (CONTEXT.md)
- Todo módulo nasce com um **`CONTEXT.md` co-localizado** com seu código (template `module_context_template.md`), gerado na Fase 5.
- O `CONTEXT.md` deixa **sem ambiguidade**: responsabilidade (e não-responsabilidade), **invariantes** (pré/pós-condições), **fluxos** de que participa, API pública, casos de borda e permissões.
- Regra de ouro: deve ser possível entender o módulo **lendo só o `CONTEXT.md`, sem abrir o código**. Documento desatualizado é tratado como bug (corrigido na Fase 5).
