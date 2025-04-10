FROM ghcr.io/puppeteer/puppeteer:24.6.0

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["node", "app.js"]
