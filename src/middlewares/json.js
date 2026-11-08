/**
 * Reads the request body stream, parses it as JSON into `req.body`
 * and sets the JSON content type on the response.
 */
export async function json(req, res) {
  const buffers = []

  for await (const chunk of req) {
    buffers.push(chunk)
  }

  const rawBody = Buffer.concat(buffers).toString()

  req.body = rawBody ? JSON.parse(rawBody) : null

  res.setHeader('Content-Type', 'application/json')
}
