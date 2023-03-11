FROM node:16.17.0-bullseye-slim

# Install FFmpeg
RUN apt-get update
RUN apt-get install -y --no-install-recommends dumb-init

# Create app directory
WORKDIR /usr/src/app

COPY --chown=node:node . .
COPY package.json ./
COPY yarn.lock ./


# Install app dependencies
RUN yarn install --production --frozen-lockfile
RUN yarn prestart

COPY . .
# Run the app
EXPOSE 50921

USER node

CMD ["dumb-init", "node", "build/index.js"]
