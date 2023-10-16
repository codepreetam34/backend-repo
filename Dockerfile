# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose port 5000 for the backend service
EXPOSE 5000

# Environment variables for connecting to the MongoDB instance
ENV NODE_ENV=production
ENV MONGODB_URI="mongodb+srv://preetamwebgross:learn2progress@productapi.oskurj7.mongodb.net/product?retryWrites=true&w=majority"

# Command to start the backend service
CMD ["npm", "start"]
