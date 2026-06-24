# Contexto do Módulo: Agente Supervisor (Risk Gates)

## 1. Identidade
- **Caminho do código:** `eae/agents/supervisor.md`
- **Dono:** Governance / Agentic Ecosystem
- **Responsabilidade (uma frase):** Atua como o ponto de controle de segurança (risk gates) da IA, interrompendo a execução autônoma antes de operações de alto risco.

## 2. Responsabilidade & Fronteira
- **Faz:**
  - Avalia se a ação proposta pela IA corresponde a algum dos gates de risco definidos em `eae/config.md`.
  - Impõe paradas explícitas e exige confirmação humana antes de:
    - Quebras de API pública de módulos.
    - Operações destrutivas ou migrações de dados irreversíveis.
    - Alteração de dependências externas sem aprovação.
    - Publicações, pushs ou deploys no ambiente de produção.
- **NÃO faz:**
  - Não executa a codificação dos módulos.
  - Não decide a prioridade de negócios (responsabilidade do Diretor Executivo).

## 3. API Pública (contrato)
O contrato é relacional: o Supervisor intercepta transições de fases no loop de agentes e bloqueia a execução caso algum gate seja acionado.

## 4. Invariantes
- Nenhum nível de autonomia (mesmo o Autônomo Total) pode ignorar os gates de risco do Supervisor.
- Em caso de dúvida sobre a periculosidade de uma ação, a mesma deve ser classificada como de risco e a execução deve ser pausada.

## 5. Modelo de Dados / Entidades que possui
- N/A.

## 6. Fluxos de que participa
- **Loop de Desenvolvimento de Features:** Avalia a transição de cada fase (Fase 1 -> 5) e valida se os planos de teste ou deploy tocam recursos críticos.

## 7. Dependências (saída)
- `eae/config.md` — Lista de gates.
- `eae/constitution.md` — Princípios de segurança.

## 8. Erros & Casos de Borda
- **Instabilidade de Testes:** Caso ocorram falhas de testes persistentes, o Supervisor bloqueia a liberação e reverte o código para o último estado estável.

## 9. Permissões / Acesso
- Modulação restrita apenas a ajustes na constituição do ecossistema.

## 10. Testes
- N/A.
