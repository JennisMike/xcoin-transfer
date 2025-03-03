# Stage 1: Build the React app
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code and build
COPY . .
RUN npm run build

# Stage 2: Serve the React build using Nginx
FROM nginx:alpine

# Copy the build output from the previous stage to the Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to serve the app
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]