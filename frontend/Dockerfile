# Build from repository root: docker build -f frontend/Dockerfile .
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/
RUN pnpm install --frozen-lockfile --filter frontend
COPY frontend ./frontend

# Set at build time in Railway: VITE_API_BASE_URL=https://<your-api>.up.railway.app/api
ARG VITE_API_BASE_URL=http://localhost:4000/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN pnpm --filter frontend build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve@14
COPY --from=builder /app/frontend/dist ./dist
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["sh", "-c", "exec serve -s dist -l tcp://0.0.0.0:${PORT}"]
