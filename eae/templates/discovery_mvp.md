# 🗣️ Roteiro de Discovery de MVP (linguagem não técnica)

> **Regra da IA:** Use na Fase 1. Faça **UMA pergunta por vez**, em português
> simples. Pare assim que 3, 4 e 9 estiverem claras (mínimo para construir).
> Para cada resposta, mapeie para o artefato indicado em "→ vira". Nunca use
> jargão (banco de dados, API, auth) com o usuário.

## Essenciais (definem o que será construído)
1. **O que você quer que o app faça, em uma frase?**
   _ex: "Anotar os gastos do mês e ver quanto sobrou."_ → vira: visão/ideia central.
2. **Quem vai usar e que problema isso resolve pra essa pessoa?**
   _ex: "Eu e minha esposa; a gente se perde nos gastos."_ → `product_vision.md`.
3. **Qual é a ÚNICA coisa mais importante que a pessoa precisa conseguir fazer?**
   _ex: "Registrar um gasto em 5 segundos."_ → **escopo do MVP** (funcionalidade central).
4. **Quando ela termina essa ação, o que aparece / o que ela ganha?**
   _ex: "A lista atualizada e o total do mês."_ → **critérios de aceite**.
5. **Onde você imagina usando: no celular, no navegador do computador, ou os dois?**
   _ex: "No celular, pelo navegador."_ → `stack.md` (plataforma).
6. **O app precisa lembrar informações entre um uso e outro? Quais?**
   _ex: "Sim, a lista de gastos."_ → `entities.md` (dados a guardar).
7. **Cada pessoa tem a própria conta privada, ou é aberto sem login?**
   _ex: "Aberto, só eu uso por enquanto."_ → `permissions.md` (login/privacidade).

## Afinam (qualidade do resultado)
8. **Tem algum app cuja aparência você gosta? Alguma cor ou "cara"?**
   _ex: "Tipo o Nubank, limpo e roxo."_ → `knowledge/design-system.md` (designer_ux).
9. **O que pode ficar pra depois — legal, mas que NÃO precisa agora?**
   _ex: "Gráficos, exportar pra Excel."_ → **não-objetivos** do spec (impede inchaço).
10. **Como você vai saber que o app "deu certo"?**
    _ex: "Se eu registrar gasto todo dia por uma semana."_ → métrica de validação.

## Regra de bolso
Se 3 (ação central), 4 (resultado) e 9 (não-objetivos) estão claras, **já dá para
construir um MVP real**. O resto só refina.
