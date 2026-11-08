FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY assets ./assets
RUN mkdir -p data && chown node:node data

ENV PORT=3333
ENV DATABASE_PATH=/app/data/db.json

EXPOSE 3333

USER node

CMD ["node", "src/server.js"]
