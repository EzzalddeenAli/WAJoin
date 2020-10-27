FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g nodemon

COPY . .

EXPOSE 80
CMD [ "node", "index.js" ]
