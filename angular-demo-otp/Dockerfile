# Stage 1: Build the Angular application
FROM node:alpine AS build

# Setup the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN yarn install

# Copy other files and folders to the working directory
COPY . .

# Build Angular application in PROD mode
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Copy built Angular app files to Nginx HTML folder
#COPY --from=build /usr/src/app/dist/angular-demo-otp /usr/share/nginx/html

COPY --from=build /usr/src/app/dist/angular-demo-otp/browser /usr/share/nginx/html

RUN ls /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]