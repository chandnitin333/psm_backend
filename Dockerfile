# Use the official Node.js 20 image
FROM node:20

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json first to install dependencies
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Install TypeScript as a dev dependency (if not already in package.json)
RUN npm install --save-dev typescript

# Build the TypeScript code (compile to dist folder)
RUN npx tsc

# Expose port 4444
EXPOSE 4444

# Command to run your app using Node.js
CMD ["node", "dist/app.js"]
