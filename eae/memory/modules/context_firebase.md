# Contexto do Módulo: Firebase Client (Lib)

## 1. Identidade
- **Caminho do código:** `src/lib/firebase.js`
- **Dono:** Infraestrutura (Lib)
- **Responsabilidade (uma frase):** Inicializa a aplicação client do Firebase usando as variáveis de ambiente e exporta instâncias ativas do Firestore e Auth.

## 2. Responsabilidade & Fronteira
- **Faz:**
  - Carrega a configuração do Firebase obtida via `import.meta.env` (Vite).
  - Inicializa o app Firebase (`initializeApp`).
  - Cria e exporta o serviço do banco de dados Firestore (`db`).
  - Cria e exporta o serviço de autenticação FirebaseAuth (`auth`).
- **NÃO faz:**
  - Não gerencia regras de segurança (estas residem no arquivo `firestore.rules`).
  - Não faz chamadas de rede diretas (apenas inicializa a biblioteca).

## 3. API Pública (contrato)
```javascript
export const db // Instância ativa do Firestore
export const auth // Instância ativa do FirebaseAuth
```

## 4. Invariantes
- Apenas uma única instância da aplicação Firebase é inicializada por ciclo de execução do app.
- As variáveis de ambiente do Firebase são validadas em tempo de build (Vite).

## 5. Modelo de Dados / Entidades que possui
- N/A.

## 6. Fluxos de que participa
- **Inicialização do App:** Ponto de partida de todos os serviços de banco de dados e login.

## 7. Dependências (saída)
- Dependências npm: `firebase/app`, `firebase/firestore`, `firebase/auth`.

## 8. Erros & Casos de Borda
- **Variáveis de Ambiente Faltantes:** O app falhará em carregar na montagem inicial se o `.env` de build não possuir as chaves corretas.

## 9. Permissões / Acesso
- Acesso total às configurações. As permissões de acesso ao banco real são delegadas para o Firestore Security Rules.

## 10. Testes
- N/A.
