# 🧠 Exemplo de lessons_learned.md preenchido

> Exemplos reais de lições (stack JS/TS). Servem de referência de formato — apague
> as que não se aplicam ao seu projeto.

- **[React] setState síncrono no primeiro render**
  - Problema: chamar `setState` dentro de `useEffect` no primeiro render (ex: carregar dados locais) causa "cascading renders" e é barrado pelo linter.
  - Solução: usar *lazy initialization* — `useState(() => loadData())`.

- **[TypeScript/Vite] verbatimModuleSyntax**
  - Problema: import de tipos quebra o build quando `verbatimModuleSyntax` está ligado (padrão nas versões novas do Vite).
  - Solução: usar `import type { ... }` para tipos.

- **[Node.js] spawn de build**
  - Problema: retornar a porta antes do servidor subir.
  - Solução: ler o `stdout` do processo e só retornar quando o servidor confirmar que subiu.
