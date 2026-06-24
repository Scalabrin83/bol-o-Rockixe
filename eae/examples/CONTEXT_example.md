# Contexto do Módulo: expenses (EXEMPLO)

> Exemplo de `CONTEXT.md` preenchido, para mostrar o formato. Apague — é só referência.

## 1. Identidade
- **Caminho do código:** `src/modules/expenses`
- **Dono:** camada de features
- **Responsabilidade (uma frase):** registrar e listar despesas do casal.

## 2. Responsabilidade & Fronteira
- **Faz:** CRUD de despesas, cálculo de totais por categoria.
- **NÃO faz:** autenticação (é do módulo `auth`), formatação de moeda na UI (é da camada de view).

## 3. API Pública (contrato)
```ts
addExpense(input: NewExpense): Expense
listExpenses(filter?: ExpenseFilter): Expense[]
totalByCategory(): Record<ExpenseCategory, number>
```

## 4. Invariantes
- `amount > 0` sempre; despesa com valor ≤ 0 é rejeitada.
- `id` é imutável após criação.
- **Pós-condição:** `totalByCategory` soma exatamente os `amount` de `listExpenses()`.

## 5. Modelo de Dados / Entidades que possui
- `Expense` (dono deste módulo; registrado em `entities.md`).

## 6. Fluxos de que participa
- "Lançar despesa" — recebe input validado e persiste.

## 7. Dependências (saída)
- `storage` (infra) — persistência. Não depende de UI nem de `auth`.

## 8. Erros & Casos de Borda
- Lança `InvalidAmountError` se `amount <= 0`.
- Lista vazia retorna `[]`, nunca `null`.

## 9. Permissões / Acesso
- Só o casal autenticado lê/escreve (ver `permissions.md`).

## 10. Testes
- **Onde:** `src/modules/expenses/__tests__`
- **Cobre:** unidade (cálculo), contrato (API pública), invariante de `amount > 0`.

## 11. Decisões relacionadas
- ADR `0002-persistencia-localstorage.md`.
