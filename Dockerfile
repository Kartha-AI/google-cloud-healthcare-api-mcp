# Generated by https://smithery.ai. See: https://smithery.ai/docs/config#dockerfile
FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --ignore-scripts

# Copy rest of the code
COPY . .

# Build the project
RUN npm run build

# Expose port if needed (e.g., the auth callback port)
EXPOSE 3456

# Start the server
CMD ["node", "build/index.js"]
