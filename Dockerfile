FROM node:20

WORKDIR /app

COPY package*.json ./

COPY . .

# RUN NODE_ENV=dev

# RUN npm audit fix --force

# RUN npm run build
RUN npm install -g ts-node nodemon
RUN npm install
RUN npm install typescript

EXPOSE 4444

CMD ["ts-node", "src/app.ts"] 