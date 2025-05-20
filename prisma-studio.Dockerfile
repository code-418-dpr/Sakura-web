ARG NODE_VERSION=24.0
FROM node:${NODE_VERSION}-alpine AS base
RUN apk add --no-cache openssl
WORKDIR /app

FROM base as deps
COPY package.json .
RUN npm install prisma @prisma/client
COPY prisma/schema.prisma ./prisma/
RUN npx prisma generate

FROM deps AS start
EXPOSE 5555
CMD ["npx", "prisma", "studio"]