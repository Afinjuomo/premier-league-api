# Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

#  app dependencies
RUN npm install

# Copy the rest of the app's code to the container
COPY . .

#  compile with typescript
RUN npm run build

# Expose the port your app runs on
EXPOSE 5000

# Define the command to run the app
CMD ["npm", "start"]
