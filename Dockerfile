FROM node:16 AS base
WORKDIR /app
COPY package.json ./

FROM base AS development
COPY index.js ./
RUN npm install -s
CMD ["npm", "run", "debug"]

FROM base AS production
COPY app ./app
COPY public ./public
COPY static ./static
COPY views ./views
RUN npm install --production
CMD ["npm", "start"]
