# Especificação Técnica: Controle Financeiro para Casal (v4 - Polimento e UX)

## 1. Visão Geral
Adição de micro-interações, feedbacks visuais síncronos e sistema de categorização para melhorar o contexto cognitivo dos dados na tela.

## 2. Stack Tecnológico Adicional
- **Toasts / Notificações:** Sonner

## 3. Modelo Atualizado
```typescript
type ExpenseCategory = 'Festa' | 'Lua de Mel' | 'Moradia' | 'Enxoval' | 'Outros';

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string; 
  paidBy: Payer;
  paymentMethod: PaymentMethod;
  category: ExpenseCategory; // NOVO CAMPO
}
```

## 4. Evoluções de Componentes
- **App.tsx:** Implementa o Provider `<Toaster />` global e gerencia as chamadas de `toast.success` e `toast()` nos handlers. Controla a animação de `pulse-anim` do botão de FAB condicionalmente.
- **ExpenseList.tsx:** Implementa o motor de renderização condicional de ícones e backgrounds com base na categoria e aplica _Staggered Delays_ no `.expense-item` (`animationDelay: index * 0.05s`). 
- **Timezone Safety:** Datas agora são parseadas e formatadas localmente utilizando a API `Intl.DateTimeFormat`.
