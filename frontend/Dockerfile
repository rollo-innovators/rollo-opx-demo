# Frontend Dockerfile (frontend/Dockerfile)

FROM node:latest

WORKDIR /app/frontend

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY . .

EXPOSE 3000

# next build
RUN pnpm run build

# next start
CMD ["pnpm", "run", "start"]