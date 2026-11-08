# CLAUDE.md

Tasks CRUD REST API with **pure Node.js** (Rocketseat Ignite, Module 01). It is a learning project,
so keep it simple and stick to the fundamentals.

## Rules

- **No frameworks or extra deps.** Use only `node:*` modules. `csv-parse` is the only dependency and
  is used only by the import script.
- ESM (`"type": "module"`), Node 24. Always write imports with the `.js` extension.
- Code, comments and docs in English.

## Commands

- `npm run dev`: server with `--watch` on `:3333`
- `npm run import:csv [-- file.csv]`: import tasks (needs the API running)
- `docker compose up -d --build`: run in Docker (DB in `./data/db.json`)
- No test suite: check changes with `curl` (examples in README.md)

## Architecture (`src/`)

`server.js` → `routes/` (method + RegExp from `utils/build-route-path.js`) → `controllers/` →
`validators/` + `database/database.js` (JSON file; tables are top-level arrays).

- To return an error, throw `new HttpError(status, message)`. `server.js` turns it into `{ message }`.
- To add a resource, create `routes/<name>-routes.js` and spread it into `routes/index.js`.
- Status codes: `201` create, `200` list, `204` update/delete/toggle, `400` validation, `404` not found.

## Git

Git Flow: `feature/*` → PR into `develop` → `main`. Use Conventional Commits (`feat(scope): ...`).
Commit or merge only after the user has reviewed.
