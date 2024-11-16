# Stage 1: Build
FROM node:18-alpine AS builder
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
# Устанавливаем только production зависимости и очищаем кэш
RUN npm ci --only=production && \
    npm i -g @nestjs/cli nodemon && \
    npm cache clean --force && \
    rm -rf /root/.npm

COPY --from=builder /app/dist ./dist
COPY tsconfig.json ./
COPY src ./src
EXPOSE 4000

ENV NODE_OPTIONS="--max-old-space-size=1536"
CMD ["npm", "run", "start:dev"]
