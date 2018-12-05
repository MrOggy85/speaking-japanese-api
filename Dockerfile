FROM node:10.14.1-alpine AS builder

WORKDIR /home/node/app

COPY . .

RUN node --max_old_space_size=512 `which npm` ci && node --max_old_space_size=512 `which npm` run build

# ------------------------------------
FROM node:10.14.1-alpine
ENV NODE_ENV=production
WORKDIR /home/node/app

COPY ./package* ./

RUN node --max_old_space_size=512 `which npm` ci && \
    node --max_old_space_size=512 `which npm` cache clean --force

# Copy builded source from the upper builder stage
COPY --from=builder /home/node/app/dist ./dist

# install Dockerize to be able to wait for Mongo
RUN apk update && \
  apk add ca-certificates wget && \
  update-ca-certificates && \
  apk add --no-cache openssl

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

EXPOSE 8081

CMD ["dockerize", "-wait", "http://mongo:27017", "node", "--max_old_space_size=512", "./dist/app.js"]
