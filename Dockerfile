FROM node:13

WORKDIR /usr/src/app

COPY package*.json ./
COPY . .

ENV PATH /usr/src/app/node_modules/.bin:$PATH

ENV PIXIE_API_PORT 8000
ENV NODE_ENV production

RUN npm install

EXPOSE 8000

CMD [ "npm", "run", "production" ]