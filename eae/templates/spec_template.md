# Especificação Técnica: <Nome da Feature>

> Gerado na Fase 2. Todas as seções abaixo são **obrigatórias**.

## 1. Modo
- [ ] Criação (módulo novo)  ·  [ ] Evolução (módulo existente)
- Módulo(s) afetado(s): `<modulo>`

## 2. Visão Geral
_O que será feito e por quê (1–3 parágrafos)._

## 3. Fronteira do Módulo & API Pública
_O que entra/sai. Defina a interface pública — funções/endpoints/tipos expostos.
Tudo o que não estiver aqui é privado ao módulo._

```
<assinaturas da API pública>
```

## 4. Modelo de Dados
_Tipos, schemas, tabelas. Como os dados são persistidos (se forem)._

## 4b. Invariantes
_Verdades que devem valer sempre + pré/pós-condições da API pública. Vão para o
`CONTEXT.md` do módulo e devem ter teste correspondente na Fase 4._
- _ex: "total = soma dos itens"; "id é imutável após criação"._

## 5. Direção de Dependência
_De quem este módulo depende e quem pode depender dele. Confirmar que não cria
ciclo (constitution.md §2)._

## 6. Plano de Testes
- Unidade: _lógica de domínio a cobrir._
- Contrato: _como a API pública será testada._
- (Evolução) Regressão: _testes dos dependentes que precisam continuar passando._

## 7. Critérios de Aceite
_Lista verificável, vinda da Fase 1. Cada item terá um teste correspondente._
- [ ] ...
- [ ] ...

## 8. Riscos / Gates
_Algo aqui dispara um gate de risco do CONFIG? (quebra de API, dado destrutivo,
dependência nova, etc.)_
