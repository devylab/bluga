FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
COPY prisma ./

# Install app dependencies
RUN yarn install --production --frozen-lockfile

COPY . .

# Run the app
EXPOSE 50921

CMD ["node", "build/index.mjs"]
