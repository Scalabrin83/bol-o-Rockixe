# Registro: <nome do módulo>

> Índice **fino** do módulo em `eae/memory/modules/`. NÃO duplica o `CONTEXT.md` —
> aponta para ele e mantém a visão que um módulo sozinho não tem: **quem depende
> dele** (dependentes / entrada). Atualizado na Fase 5.

- **Responsabilidade (uma frase):** _..._
- **Contexto completo:** `<path/para/o/modulo>/CONTEXT.md`
- **Status:** ativo | descontinuado | em refatoração

## Dependentes (quem depende deste módulo — entrada)
_Mantido quando OUTROS módulos passam a usar este. Consultado antes de evoluí-lo
ou quebrar sua API pública (gate de risco)._
- `<modulo>` — usa qual parte da API pública.
