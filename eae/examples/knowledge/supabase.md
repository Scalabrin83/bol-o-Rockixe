# 📚 Exemplo: knowledge/supabase.md

> Exemplo de arquivo de conhecimento por tecnologia. Mostra o **formato** — copie
> para `knowledge/` só se o projeto realmente usar Supabase. Apague se não usar.

## Receitas verificadas
- **RLS sempre ligado:** habilite Row Level Security em toda tabela exposta; sem policy = nega tudo por padrão.
- **Service role nunca no client:** a `service_role key` só no backend; no client, só a `anon key`.

## Armadilhas (cruzar com lessons_learned)
- Migrations: versionar em `supabase/migrations/`, não editar schema só pelo dashboard.
