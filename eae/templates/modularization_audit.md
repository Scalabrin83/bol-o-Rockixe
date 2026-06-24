# Auditoria de Modularização: <sistema>

> Gerado pelo `cartografo_legado` no Modo Brownfield. É um **mapa do que existe** +
> plano de modularização. Não autoriza refatorar nada cujo comportamento não esteja
> travado por teste de caracterização.

## 1. Inventário
- **Stack/linguagens:** _detectado._
- **Pontos de entrada:** _rotas, CLIs, jobs, etc._
- **Tamanho/áreas quentes:** _onde está a maior parte da lógica / churn._

## 2. Módulos candidatos
| Candidato | Responsabilidade (observada) | Arquivos/áreas | Confiança |
|-----------|------------------------------|----------------|-----------|
| <nome> | ... | ... | alta/média/baixa |

## 3. Mapa de dependências & violações
- **Grafo (resumo):** `A → B → C`...
- **Violações detectadas:**
  - [ ] Ciclo: `X ↔ Y`
  - [ ] Reach-in (acesso a internals): `...`
  - [ ] God-module: `...`
  - [ ] Dependência escondida (ex: estado global, singleton): `...`

## 4. Verdades a confirmar (antes de refatorar)
_Comportamentos críticos que precisam de **teste de caracterização** travando o
estado atual. Cada item vira teste antes de qualquer mudança._
- [ ] ...

## 5. Fronteiras-alvo (depois)
_Como o sistema deveria ficar modularizado: módulos, API pública de cada um,
direção de dependência (sem ciclos)._

## 6. Plano de execução (strangler, incremental)
_Ordem segura de refatorar, priorizada por risco × valor. Cada passo é um ciclo de
Evolução gateado, com testes verdes._
1. ...
2. ...
