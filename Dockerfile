# Stage 1: Build
FROM node:18-slim AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./

RUN npm ci && \
    npm install -g ts-node typescript && \
    npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY tsconfig.json ./
COPY src ./src
EXPOSE 4000

ENV NODE_OPTIONS="--max-old-space-size=4096"
CMD ["npm", "run", "start:dev"]
