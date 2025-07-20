#Stage 1 : Building typescript application
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

#Stage 2 : Creating production image

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder app/package.json app/package-lock.json ./

COPY --from=builder /app/dist ./dist


EXPOSE 8080

CMD ["npm","start"]



