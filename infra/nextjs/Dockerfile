FROM node:20-slim
WORKDIR /app
COPY code/frontend-nextjs .
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "dev"]