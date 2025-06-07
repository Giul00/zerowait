FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY server.js ./
COPY registroRoutes.js ./
RUN npm install
COPY public ./public
EXPOSE 3000
CMD ["node", "server.js"]