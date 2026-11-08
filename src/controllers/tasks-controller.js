import { randomUUID } from 'node:crypto'

import { database } from '../database/database.js'
import { HttpError } from '../utils/http-error.js'
import { validateCreateTask, validateUpdateTask } from '../validators/task-validator.js'

const TABLE = 'tasks'

function findTaskOrFail(id) {
  const task = database.findById(TABLE, id)

  if (!task) {
    throw new HttpError(404, `Task with id "${id}" not found.`)
  }

  return task
}

export function create(req, res) {
  const { title, description } = validateCreateTask(req.body)
  const now = new Date().toISOString()

  const task = database.insert(TABLE, {
    id: randomUUID(),
    title,
    description,
    completed_at: null,
    created_at: now,
    updated_at: now,
  })

  return res.writeHead(201).end(JSON.stringify(task))
}

export function list(req, res) {
  const { search } = req.query

  const tasks = database.select(
    TABLE,
    search ? { title: search, description: search } : null,
  )

  return res.writeHead(200).end(JSON.stringify(tasks))
}

export function update(req, res) {
  const { id } = req.params
  const data = validateUpdateTask(req.body)

  findTaskOrFail(id)
  database.update(TABLE, id, { ...data, updated_at: new Date().toISOString() })

  return res.writeHead(204).end()
}

export function remove(req, res) {
  const { id } = req.params

  findTaskOrFail(id)
  database.delete(TABLE, id)

  return res.writeHead(204).end()
}

export function toggleComplete(req, res) {
  const { id } = req.params
  const task = findTaskOrFail(id)
  const now = new Date().toISOString()

  database.update(TABLE, id, {
    completed_at: task.completed_at ? null : now,
    updated_at: now,
  })

  return res.writeHead(204).end()
}
