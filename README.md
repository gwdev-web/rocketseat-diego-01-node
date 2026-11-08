# Tasks CRUD API — Node.js Fundamentals

A REST API for managing tasks, built with **pure Node.js** (no frameworks) as the solution to the
[Rocketseat Ignite Node.js — Module 01](https://app.rocketseat.com.br/projects/ignite-node-js-2023-modulo-01) challenge.

It shows the basics of Node.js that frameworks usually hide:

- The native `node:http` module, with no Express or Fastify
- **Streams**: reading the request body chunk by chunk, and parsing a CSV file line by line
- **Middlewares**: a JSON body parser
- **Routing with RegExp**: route params (`/tasks/:id`) and query params (`?search=`)
- **Persistence** in a local JSON file
- **Docker** for running the API anywhere

## Requirements

- [Docker](https://www.docker.com/) and Docker Compose, **or**
- [Node.js](https://nodejs.org/) 20+ (the version in `.nvmrc` is 24)

## Getting started

### With Docker (recommended)

```bash
docker compose up -d --build
```

The API runs at `http://localhost:3333`. Data is saved in `./data/db.json`, which is mounted as a
volume, so it is kept when the container restarts.

```bash
docker compose logs -f   # follow the logs
docker compose down      # stop
```

### Locally with Node.js

```bash
npm install
npm run dev     # with --watch (restarts on file changes)
# or
npm start
```

### Environment variables

| Variable        | Default                 | Description                         |
| --------------- | ----------------------- | ----------------------------------- |
| `PORT`          | `3333`                  | HTTP server port                    |
| `DATABASE_PATH` | `./data/db.json`        | Path of the JSON database file      |
| `API_URL`       | `http://localhost:3333` | API the CSV import script sends to  |

## Task model

| Field          | Type             | Description                                      |
| -------------- | ---------------- | ------------------------------------------------ |
| `id`           | `string` (UUID)  | Unique identifier                                |
| `title`        | `string`         | Task title                                       |
| `description`  | `string`         | Task description                                 |
| `completed_at` | `string \| null` | Date the task was completed; `null` while open   |
| `created_at`   | `string`         | Creation date (ISO 8601)                         |
| `updated_at`   | `string`         | Date of the last change (ISO 8601)               |

## Endpoints

| Method   | Route                 | Description                                   | Success |
| -------- | --------------------- | --------------------------------------------- | ------- |
| `POST`   | `/tasks`              | Create a task (`title` and `description`)     | `201`   |
| `GET`    | `/tasks?search=`      | List tasks, optionally filtered by title/description | `200` |
| `PUT`    | `/tasks/:id`          | Update `title` and/or `description`           | `204`   |
| `DELETE` | `/tasks/:id`          | Delete a task                                 | `204`   |
| `PATCH`  | `/tasks/:id/complete` | Toggle the task between completed and open    | `204`   |

Errors always have the shape `{ "message": "..." }`:

| Status | When                                                          |
| ------ | ------------------------------------------------------------- |
| `400`  | Invalid JSON, or missing/empty `title` / `description`        |
| `404`  | Task (or route) not found                                     |
| `500`  | Unexpected error                                              |

### Examples

```bash
# Create
curl -X POST http://localhost:3333/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Study streams", "description": "Readable, Writable and Transform"}'

# List all / search (case-insensitive, matches title OR description)
curl http://localhost:3333/tasks
curl "http://localhost:3333/tasks?search=streams"

# Update
curl -X PUT http://localhost:3333/tasks/<id> \
  -H "Content-Type: application/json" \
  -d '{"title": "Study Node.js streams"}'

# Toggle complete
curl -X PATCH http://localhost:3333/tasks/<id>/complete

# Delete
curl -X DELETE http://localhost:3333/tasks/<id>
```

## Importing tasks from CSV

`src/scripts/import-csv.js` reads a CSV file **as a stream** with
[`csv-parse`](https://csv.js.org/parse/), skips the header and sends a `POST /tasks` for each row.

The CSV must have this format (see [`assets/tasks.csv`](assets/tasks.csv)):

```csv
title,description
Task 01,Descrição da Task 01
Task 02,Descrição da Task 02
```

With the API running:

```bash
# Inside the container
docker compose exec api node src/scripts/import-csv.js

# Or from your machine
npm run import:csv                       # uses assets/tasks.csv
npm run import:csv -- path/to/file.csv   # custom file
```

## Project structure

```
.
├── assets/
│   └── tasks.csv                 # Sample CSV for the import script
├── data/                         # JSON database file (created at runtime, git-ignored)
├── src/
│   ├── server.js                 # HTTP server: finds the route, runs middleware, handles errors
│   ├── controllers/
│   │   └── tasks-controller.js   # Request handlers (business rules)
│   ├── database/
│   │   └── database.js           # In-memory database saved to a JSON file
│   ├── middlewares/
│   │   └── json.js               # Reads the body stream and parses JSON
│   ├── routes/
│   │   ├── index.js              # Combines all route lists
│   │   └── tasks-routes.js       # Maps method + path to a controller
│   ├── scripts/
│   │   └── import-csv.js         # CSV import (stream + csv-parse)
│   ├── utils/
│   │   ├── build-route-path.js   # Turns "/tasks/:id" into a RegExp with named groups
│   │   ├── extract-query-params.js
│   │   └── http-error.js         # Error with an HTTP status code
│   └── validators/
│       └── task-validator.js     # Request body validation
├── Dockerfile
└── docker-compose.yml
```

### Request lifecycle

```
request ─► server.js ─► find route (method + RegExp)
                        ├─ json middleware (body stream ─► req.body)
                        ├─ req.params / req.query from the RegExp groups
                        └─ controller ─► validator ─► database ─► response
               errors ─► HttpError ─► { message } with its status code
```

## Git workflow

The project follows **Git Flow** with **Conventional Commits**:

- `main`: released code
- `develop`: integration branch
- `feature/*`: one branch per feature, merged into `develop` through a pull request
- Commit messages: `feat:`, `fix:`, `chore:`, `build:`, `docs:`, `refactor:`, `test:`

## License

MIT
