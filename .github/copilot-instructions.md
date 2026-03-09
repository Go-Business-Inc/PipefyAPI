# Copilot Instructions for PipefyAPI Library

## Project Architecture

- **Single main class:** All API logic is encapsulated in `PipefyAPI` ([src/index.ts](src/index.ts)).
- **TypeScript-first:** Strict typing enforced; see [src/index.d.ts](src/index.d.ts) for exported types and interfaces.
- **GraphQL-centric:** All Pipefy operations use GraphQL queries/mutations via `pipefyFetch()`.
- **No framework:** Pure TypeScript, no Express, no server, no frontend.

## Key Workflows

- **Build:** Run `npm run build` (compiles TypeScript to `dist/`).
- **Install:** Use `npm install` for dependencies. Only `node-fetch` is required at runtime.
- **API Usage:** Import and instantiate `PipefyAPI` with required credentials. See [README.md](README.md) for example.
- **Testing:** No test scripts or test files present; add tests in `src/` and use Jest if needed.

## Conventions & Patterns

- **Error Logging:** Use the `logError()` method to log errors to a Pipefy table (see Log Table setup in [README.md](README.md)).
- **Field Handling:** Use `indexFields()` to map card fields by name; always prefer this for field access.
- **Relations:** Parent/child relations are handled via `getCardInfo()` and `createCardRelation()`.
- **File Uploads:** Use `uploadFileFromUrl()` or `uploadFileFromBuffer()` for file operations; always request a pre-signed URL first.
- **Internationalization:** Pass `timeZone` and `intlCode` to constructor for correct date/language formatting.

## Integration Points

- **Pipefy API:** All external calls go to `https://api.pipefy.com/graphql` (default endpoint).
- **No other external services** are integrated.
- **Credentials:** API key and organization ID must be provided by the user (see [README.md](README.md)).

## Examples

- **Create a card:**
  ```ts
  const pipefy = new PipefyAPI(apiKey, orgId, timeZone, intlCode);
  await pipefy.createCard(pipeId, dataArray);
  ```
- **Move a card:**
  ```ts
  await pipefy.moveCardToPhase(cardId, phaseId);
  ```
- **Log an error:**
  ```ts
  await pipefy.logError("Error message", 500, "functionName");
  ```

## Important Files

- [src/index.ts](src/index.ts): Main implementation
- [src/index.d.ts](src/index.d.ts): Type definitions
- [README.md](README.md): Usage, setup, and credential instructions
- [package.json](package.json): Build and dependency info

---

**For new features:**

- Follow the single-class pattern in `src/index.ts`.
- Add new Pipefy API methods as class methods.
- Update type definitions in `src/index.d.ts`.
- Document new features in [README.md](README.md).

---

**If anything is unclear or missing, please provide feedback so instructions can be improved.**
