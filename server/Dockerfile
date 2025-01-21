FROM node:22-alpine3.19
WORKDIR /home/app
RUN cd /home/app
RUN mkdir src
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]