import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'csv-parse'

const API_URL = process.env.API_URL ?? 'http://localhost:3333'
const csvPath = path.resolve(process.argv[2] ?? 'assets/tasks.csv')

/**
 * Streams a CSV file line by line and creates one task per row through
 * the API (POST /tasks). The first line (header) is skipped.
 *
 * Usage: node src/scripts/import-csv.js [path/to/file.csv]
 */
async function importCsv() {
  const parser = fs.createReadStream(csvPath).pipe(
    parse({
      delimiter: ',',
      from_line: 2,
      skip_empty_lines: true,
      trim: true,
    }),
  )

  let imported = 0
  let failed = 0

  for await (const [title, description] of parser) {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    })

    if (response.ok) {
      imported++
      console.log(`✔ ${title}`)
    } else {
      failed++
      const { message } = await response.json().catch(() => ({}))
      console.error(`✖ ${title}: ${message ?? response.statusText}`)
    }
  }

  console.log(`\nDone. Imported: ${imported}. Failed: ${failed}.`)
}

importCsv().catch((error) => {
  console.error(`Import failed: ${error.message}`)
  process.exitCode = 1
})
