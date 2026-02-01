# Build stage
FROM node:18.17.0-alpine AS builder
WORKDIR /app
COPY ../code/frontend-nextjs/package*.json ./
RUN npm install
RUN npm run build
CMD ["npm", "start"]