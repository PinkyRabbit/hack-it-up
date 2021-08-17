FROM node:14 AS base
WORKDIR /app
COPY package.json ./
COPY index.js ./
RUN npm install -s
CMD ["npm", "run", "debug"]
