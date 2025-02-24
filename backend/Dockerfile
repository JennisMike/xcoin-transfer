FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

# Copy the rest of your application source code
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
