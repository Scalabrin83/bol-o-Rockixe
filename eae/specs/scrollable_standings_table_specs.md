# Especificação Técnica: Tabela de Classificação Responsiva (Scrollável)

> Gerado na Fase 2. Todas as seções abaixo são **obrigatórias**.

## 1. Modo
- [x] Evolução (módulo existente)
- Módulo(s) afetado(s): `Classificacao`

## 2. Visão Geral
Esta evolução altera o layout de exibição da tabela de classificação de grupos para introduzir rolagem horizontal nas colunas estatísticas centrais, fixando o nome da seleção e a pontuação nas laterais. Isso resolve a quebra de texto dos nomes das seleções em telas mobile, onde as 9 colunas originais não cabiam simultaneamente.

## 3. Fronteira do Módulo & API Pública
Nenhuma nova API pública é criada. O componente React `Classificacao.jsx` continua exportando a mesma interface de visualização.

## 4. Modelo de Dados
Nenhuma alteração em modelo de dados. A tabela continua lendo e renderizando as estatísticas locais calculadas pela função `getGroupStandings`.

## 4b. Invariantes
- A tabela de classificação deve sempre manter o alinhamento das linhas entre a coluna sticky esquerda, o bloco de dados central e a coluna sticky direita.
- Os indicadores visuais de qualificação (borda verde/amarela) devem permanecer grudados à esquerda da tela.

## 5. Direção de Dependência
- Depende de: `index.css` (para regras CSS de posicionamento pegajoso).

## 6. Plano de Testes
- **Visual/Responsivo**: Validar a tabela nas larguras de 320px, 375px, 414px (celulares comuns) e >768px (tablets/desktops) para assegurar que:
  - O scroll horizontal é ativado apenas se a largura for inferior à largura mínima das colunas.
  - A rolagem não distorce o alinhamento das colunas.
  - O conteúdo oculto sob as colunas sticky não fica vazando ou visível sob transparência.

## 7. Critérios de Aceite
- [ ] Nome do time fixo à esquerda com z-index adequado.
- [ ] Pontos (Pts) fixo à direita com z-index adequado.
- [ ] Rolagem horizontal ativada para P, V, E, D, GP, GC, SG.
- [ ] Borda verde/amarela fixa na lateral esquerda da linha de seleção.
- [ ] Sem regressão visual em telas desktop.

## 8. Riscos / Gates
- Nenhum. Mudança puramente visual e de usabilidade CSS.
