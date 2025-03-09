FROM node:18-alpine AS build-stage

WORKDIR /app

COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

FROM node:18-alpine AS production-stage

WORKDIR /app

COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/node_modules ./node_modules

RUN npm install -g serve
EXPOSE 3000
ENV API_HOST=host.docker.internal

CMD ["serve", "-s", "dist", "-l", "3000"]