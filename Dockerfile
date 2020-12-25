FROM node:14-slim as production
EXPOSE 3000
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./ 
RUN npm install --only=production \
  && npm cache clean --force
COPY . .
CMD [ "node", "./app/index.js" ]
ENV NODE_ENV = production

