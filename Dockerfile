# Stage 1: Build the application
FROM node:14 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
# Install additional dependencies, if needed
RUN npm install -D webpack-cli
COPY . .
RUN npm run build

# Stage 2: Create a smaller image for runtime
FROM node:14
WORKDIR /app
COPY --from=builder /app /app
EXPOSE 5000
ENV NODE_ENV=production
ENV MONGODB_URI="mongodb+srv://preetamwebgross:learn2progress@productapi.oskurj7.mongodb.net/product?retryWrites=true&w=majority"


CMD ["npm", "start"]
