FROM node:25
WORKDIR /app
COPY code/frontend-nextjs/package*.json ./
RUN npm install
COPY code/frontend-nextjs/ .
EXPOSE 3000
CMD ["npm", "run", "dev"]