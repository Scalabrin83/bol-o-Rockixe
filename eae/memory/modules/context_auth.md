# Contexto do Módulo: Autenticação (Auth)

## 1. Identidade
- **Caminho do código:** `src/contexts/AuthContext.jsx`
- **Dono:** Core / Camada de Negócio
- **Responsabilidade (uma frase):** Gerencia a sessão do participante, registro de novos usuários no Firestore e login baseado em telefone.

## 2. Responsabilidade & Fronteira
- **Faz:**
  - Inicializa o observador de estado de autenticação (`onAuthStateChanged`).
  - Cria novas contas de usuário usando o telefone como login (transformado em e-mail fictício `@bolao.rockixe`).
  - Registra o perfil do participante no Firestore (`users/{uid}`) com status inicial `pending`.
  - Provê funções de login, logout e exporta o objeto do usuário logado (`currentUser`) e seus dados complementares (`userData`).
- **NÃO faz:**
  - Não faz a validação de PIX (responsabilidade do painel Admin).
  - Não altera pontos de ranking.

## 3. API Pública (contrato)
```javascript
export function useAuth() // Retorna o contexto AuthContext
// Propriedades do contexto:
currentUser // Objeto de usuário do Firebase Auth
userData // Dados do usuário no Firestore (name, phone, status, points, etc.)
register(phone, password, name, championTeamId) // Cria conta e perfil no banco
login(phone, password) // Autentica no Firebase
logout() // Desconecta o usuário
```

## 4. Invariantes
- Todo usuário registrado no Firebase Auth possui um documento idêntico na coleção `/users/{uid}`.
- O campo `isAdmin` só pode ser alterado por administradores diretamente no banco.

## 5. Modelo de Dados / Entidades que possui
- `/users/{uid}`: Perfil do participante contendo `name`, `phone`, `status` (pending | confirmed), `points`, `exactScores`, `isAdmin` e `championTeamId`.

## 6. Fluxos de que participa
- **Cadastro de Participante:** Cria registro de autenticação e cria perfil no banco.
- **Login e Controle de Rota:** Permite acesso às rotas privadas da aplicação.

## 7. Dependências (saída)
- `src/lib/firebase.js` — Cliente do Firestore e Auth.

## 8. Erros & Casos de Borda
- **Telefone Duplicado:** Lança erro se tentar registrar um telefone que já existe.
- **Sessão Expirada:** Limpa automaticamente o `userData` e redireciona para a página `/login`.

## 9. Permissões / Acesso
- O próprio usuário pode ler seus dados no Firestore. A alteração e deleção de dados é restrita a administradores.

## 10. Testes
- N/A (A ser implementado).
