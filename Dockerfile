#
# First step: Compile Typescript to Javascript
#
FROM node:14.15.3 AS build

WORKDIR /usr/build/config-service
# Get dependencies before everything else to cache it
COPY package*.json ./
# Same with ts config
COPY tsconfig*.json ./
# Copy only the typescript code
COPY ./src ./src
# Install packages and compile Typescript code
RUN npm ci --quiet && npm run make

#
# Production step: Get Javascript code from the build process
#
FROM node:lts-alpine3.10

WORKDIR /app
ENV NODE_ENV=production
ENV REDIS_HOST=127.0.0.1
ENV REDIS_PORT=6379

COPY package*.json ./
RUN npm ci --quiet --only=production

## We just need the build to execute the command
COPY --from=build /usr/build/config-service/build ./

CMD ["node", "index.js"]
EXPOSE 3456