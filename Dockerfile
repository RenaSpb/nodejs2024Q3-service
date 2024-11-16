# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci && npm i -g @nestjs/cli
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm i -g @nestjs/cli
COPY --from=builder /app/dist ./dist
COPY tsconfig.json ./
ENV NODE_OPTIONS="--max-old-space-size=512"
EXPOSE 4000
CMD ["npm", "run", "start:dev"]
