import http from 'node:http'

const PORT = Number(process.env.PORT) || 3333

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json')
  return res.writeHead(200).end(JSON.stringify({ status: 'ok' }))
})

server.listen(PORT, () => {
  console.log(`HTTP server running on http://localhost:${PORT}`)
})
