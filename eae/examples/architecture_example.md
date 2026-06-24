# 🏛️ Exemplo de architecture.md preenchido

> Este arquivo é apenas um **exemplo** de como `memory/architecture.md` fica
> depois de alguns ciclos do loop. Não é regra do framework — pode apagar.

## Padrões do Projeto (exemplo)
- **Stack:** Vite + React + TypeScript, Express no backend.
- **Estilos:** Vanilla CSS com variáveis (Champanhe, Azul Marinho, Cinza Chumbo).
- **Regras de Negócio:** O "BookingFlow" nunca oferece horário fechado/bloqueado.

## Módulo: Controle Financeiro Casal
- **Stack:** Vite + React + TypeScript.
- **Persistência:** LocalStorage (`@controle-casal:expenses`).
- **Modelo:** `Expense { id, description, amount, date, paidBy, paymentMethod, category }`.
