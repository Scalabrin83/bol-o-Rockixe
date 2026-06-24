# 📦 Registro de Módulos (índice fino)

Cada módulo tem aqui um `<modulo>.md` **fino**, gerado de
`templates/module_registry_template.md`. Ele NÃO é a fonte da verdade do módulo —
ele **aponta** para o `CONTEXT.md` co-localizado com o código (a fonte completa,
gerada de `templates/module_context_template.md`).

## Divisão de responsabilidades (sem duplicar)
- **`<modulo>/CONTEXT.md`** (junto ao código) → tudo sobre o módulo: responsabilidade, **invariantes**, **fluxos**, API pública, casos de borda, permissões, testes. É o que a IA lê na Fase 2.
- **`memory/modules/<modulo>.md`** (aqui) → ponteiro + **dependentes (quem depende dele)**. Essa visão reversa é o que se consulta antes de evoluir/quebrar a API de um módulo.
- **`memory/architecture.md`** → mapa de alto nível de todos os módulos.

Nasce vazio. O loop cria as duas peças na Fase 5 de cada módulo novo.
