import { HttpError } from '../utils/http-error.js'

const isFilledString = (value) => typeof value === 'string' && value.trim() !== ''

function assertOptionalField(body, field) {
  if (body[field] !== undefined && !isFilledString(body[field])) {
    throw new HttpError(400, `"${field}" must be a non-empty string.`)
  }
}

/** POST /tasks: `title` and `description` are both required. */
export function validateCreateTask(body) {
  if (!body || typeof body !== 'object') {
    throw new HttpError(400, 'Request body is required.')
  }

  const missing = ['title', 'description'].filter((field) => !isFilledString(body[field]))

  if (missing.length > 0) {
    throw new HttpError(400, `Missing or invalid fields: ${missing.join(', ')}.`)
  }

  return { title: body.title.trim(), description: body.description.trim() }
}

/** PUT /tasks/:id: `title` and/or `description` (at least one). */
export function validateUpdateTask(body) {
  if (!body || typeof body !== 'object') {
    throw new HttpError(400, 'Request body is required.')
  }

  assertOptionalField(body, 'title')
  assertOptionalField(body, 'description')

  if (body.title === undefined && body.description === undefined) {
    throw new HttpError(400, 'Provide "title" and/or "description" to update.')
  }

  const data = {}
  if (body.title !== undefined) data.title = body.title.trim()
  if (body.description !== undefined) data.description = body.description.trim()

  return data
}
