# Contexto do Módulo: <nome>

> **CONTEXT.md — fonte da verdade deste módulo.** Fica co-localizado com o código
> (na pasta do próprio módulo). Criado/atualizado na Fase 5 de todo ciclo que toca
> o módulo. Deve ser legível por si só: qualquer um (humano ou IA) entende a
> responsabilidade, os invariantes e os fluxos **sem ler o código**.
> Preencha TODAS as seções — "N/A" é uma resposta válida, omissão não é.

## 1. Identidade
- **Caminho do código:** `<path/para/o/modulo>`
- **Dono:** _quem mantém (time/camada)._
- **Responsabilidade (uma frase):** _o que este módulo faz._

## 2. Responsabilidade & Fronteira
- **Faz:** _lista do que é responsabilidade deste módulo._
- **NÃO faz (não-responsabilidade):** _o que deliberadamente fica fora — evita escopo difuso._

## 3. API Pública (contrato)
_O único ponto de entrada para outros módulos. Tudo o mais é privado._
```
<assinaturas expostas: funções/endpoints/eventos/tipos>
```

## 4. Invariantes
_Verdades que valem **sempre**, em qualquer estado. Nunca podem ser violadas._
- _ex: "saldo nunca fica negativo"; "todo pedido tem ao menos 1 item"._
- **Pré-condições** (o que a API exige na entrada): ...
- **Pós-condições** (o que a API garante na saída): ...

## 5. Modelo de Dados / Entidades que possui
_Entidades cujo dono é este módulo (registradas em `eae/memory/entities.md`)._

## 6. Fluxos de que participa
_Workflows (de `eae/memory/workflows.md`) que passam por aqui e qual o papel deste módulo em cada um._

## 7. Dependências (saída — de quem este módulo depende)
_Direção de dependência respeitando a constituição §2. Só consome API pública dos outros._
- `<modulo/infra>` — para quê.

## 8. Erros & Casos de Borda
- **Como falha:** _erros/exceções que expõe e quando._
- **Validação de fronteira:** _o que valida nas entradas públicas._
- **Borda conhecida:** _vazio, concorrência, limite, idempotência, etc._

## 9. Permissões / Acesso
_Regras de autorização relevantes (referência a `eae/memory/permissions.md`)._

## 10. Testes
- **Onde:** `<path dos testes>`
- **Cobre:** _unidade (lógica) + contrato (API pública) + invariantes._

## 11. Decisões relacionadas
- ADR `NNNN-<slug>.md` — _decisão que moldou este módulo._
