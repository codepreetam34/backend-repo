# Use an official Node.js LTS version as a parent image for the build stage
FROM node:14 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Production stage
FROM node:14
WORKDIR /app
COPY --from=build /app /app
EXPOSE 5000

# Environment variables for connecting to the MongoDB instance
ENV NODE_ENV=production
ENV MONGODB_URI="mongodb+srv://preetamwebgross:learn2progress@productapi.oskurj7.mongodb.net/product?retryWrites=true&w=majority"

CMD ["npm", "start"]
