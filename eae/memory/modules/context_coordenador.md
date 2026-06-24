# Contexto do Módulo: Agente Coordenador (Diretor Executivo)

## 1. Identidade
- **Caminho do código:** `eae/agents/diretor_executivo.md`
- **Dono:** Governance / Agentic Ecosystem
- **Responsabilidade (uma frase):** Coordena o ciclo de desenvolvimento de ponta a ponta (Agent Loop), determinando prioridades e acionando cada agente especializado na ordem correta.

## 2. Responsabilidade & Fronteira
- **Faz:**
  - Controla as transições entre as fases (Bootstrap -> Discovery -> Spec -> Dev -> Test -> Delivery).
  - Decide qual objetivo de negócio deve ser selecionado a partir do roadmap e prioridades do usuário.
  - Aciona os demais papéis do ecossistema (`engenharia_agentica`, `guardiao_regressao`, `designer_ux`, `auditor_acessibilidade`) para tarefas específicas.
- **NÃO faz:**
  - Não codifica soluções nem escreve especificações técnicas detalhadas diretamente (delegação).
  - Não ignora os limites de risco sem consentimento do Supervisor.

## 3. API Pública (contrato)
O contrato é relacional: Orquestra o ciclo de vida de desenvolvimento, gerenciando o andamento das tarefas e decidindo quando transitar para a próxima fase.

## 4. Invariantes
- Apenas uma única funcionalidade/MVP pode ser desenvolvida por vez para garantir a estabilidade do sistema em produção.
- Respeita o nível de autonomia definido no arquivo de configuração do projeto.

## 5. Modelo de Dados / Entidades que possui
- N/A.

## 6. Fluxos de que participa
- **Loop de Desenvolvimento de Features:** O Diretor Executivo lidera a inicialização de qualquer mudança no sistema.

## 7. Dependências (saída)
- `eae/protocol.md` — Passos de cada fase.
- `eae/config.md` — Definição do nível de autonomia.
- `eae/memory/roadmap.md` — Lista de objetivos.

## 8. Erros & Casos de Borda
- **Mudança de Requisitos no Meio do Ciclo:** Caso os requisitos mudem durante o desenvolvimento, o Diretor Executivo cancela o ciclo atual, executa o rollback do código e inicia uma nova fase de Discovery (Fase 1).

## 9. Permissões / Acesso
- Acesso completo ao ecossistema para delegação e orquestração.

## 10. Testes
- N/A.
