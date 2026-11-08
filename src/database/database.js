import fs from 'node:fs'
import path from 'node:path'

const DATABASE_PATH = path.resolve(process.env.DATABASE_PATH ?? 'data/db.json')

/**
 * A minimal in-memory database persisted to a JSON file.
 *
 * Shape on disk: { "<table>": [ { ...row }, ... ] }
 */
export class Database {
  #database = {}

  constructor() {
    try {
      this.#database = JSON.parse(fs.readFileSync(DATABASE_PATH, 'utf-8'))
    } catch {
      // File missing or invalid: start empty and create it.
      this.#persist()
    }
  }

  #persist() {
    fs.mkdirSync(path.dirname(DATABASE_PATH), { recursive: true })
    fs.writeFileSync(DATABASE_PATH, JSON.stringify(this.#database, null, 2))
  }

  /**
   * Returns all rows of a table. When `search` is given, returns rows where
   * ANY of the given fields contains the given value (case-insensitive).
   */
  select(table, search) {
    const rows = this.#database[table] ?? []

    if (!search) return rows

    const filters = Object.entries(search)

    return rows.filter((row) =>
      filters.some(([key, value]) =>
        String(row[key] ?? '').toLowerCase().includes(String(value).toLowerCase()),
      ),
    )
  }

  findById(table, id) {
    return this.select(table).find((row) => row.id === id) ?? null
  }

  insert(table, data) {
    if (!Array.isArray(this.#database[table])) {
      this.#database[table] = []
    }

    this.#database[table].push(data)
    this.#persist()

    return data
  }

  update(table, id, data) {
    const rows = this.#database[table] ?? []
    const index = rows.findIndex((row) => row.id === id)

    if (index === -1) return null

    rows[index] = { ...rows[index], ...data, id }
    this.#persist()

    return rows[index]
  }

  delete(table, id) {
    const rows = this.#database[table] ?? []
    const index = rows.findIndex((row) => row.id === id)

    if (index === -1) return false

    rows.splice(index, 1)
    this.#persist()

    return true
  }
}

export const database = new Database()
