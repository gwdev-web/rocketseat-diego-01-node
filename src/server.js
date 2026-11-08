import http from 'node:http'

import { json } from './middlewares/json.js'
import { routes } from './routes/index.js'
import { extractQueryParams } from './utils/extract-query-params.js'
import { HttpError } from './utils/http-error.js'

const PORT = Number(process.env.PORT) || 3333

function sendError(res, statusCode, message) {
  res.setHeader('Content-Type', 'application/json')
  return res.writeHead(statusCode).end(JSON.stringify({ message }))
}

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  try {
    const route = routes.find(
      (route) => route.method === method && route.path.test(url),
    )

    if (!route) {
      return sendError(res, 404, `Route ${method} ${url} not found.`)
    }

    try {
      await json(req, res)
    } catch {
      return sendError(res, 400, 'Invalid JSON body.')
    }

    const { query, ...params } = url.match(route.path).groups

    req.params = params
    req.query = extractQueryParams(query)

    return await route.handler(req, res)
  } catch (error) {
    if (error instanceof HttpError) {
      return sendError(res, error.statusCode, error.message)
    }

    console.error(error)
    return sendError(res, 500, 'Internal server error.')
  }
})

server.listen(PORT, () => {
  console.log(`HTTP server running on http://localhost:${PORT}`)
})
