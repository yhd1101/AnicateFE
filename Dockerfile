FROM node

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN rm -rf node_modules
RUN npm i

COPY . .

## EXPOSE [Port you mentioned in the vite.config file]

EXPOSE 3000/tcp

CMD ["npm", "run", "dev"]