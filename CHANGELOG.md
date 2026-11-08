# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-11-07

### Added

- Pure Node.js HTTP server (`node:http`) with Docker and Docker Compose setup
- JSON file database saved to `DATABASE_PATH`
- JSON body middleware, RegExp route matching (route and query params) and central error handling
- Tasks CRUD: `POST /tasks`, `GET /tasks?search=`, `PUT /tasks/:id`, `DELETE /tasks/:id`,
  `PATCH /tasks/:id/complete`
- Validation of `title` / `description`, and a 404 response for unknown tasks
- CSV import script that streams the file through `csv-parse`
- README and CLAUDE.md

[1.0.0]: https://github.com/gwdev-web/rocketseat-diego-01-node/releases/tag/v1.0.0
