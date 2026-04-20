FROM node:20-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
RUN pnpm install --frozen-lockfile --filter backend
COPY backend ./backend
RUN pnpm --filter backend build
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "backend/dist/index.js"]
