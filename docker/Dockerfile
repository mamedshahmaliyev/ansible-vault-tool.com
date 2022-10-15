FROM node
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm audit fix --force
RUN npm upgrade
RUN npm install
COPY . .
CMD [ "npm", "run", "start" ]