FROM node:12.18.2

WORKDIR /app

# Copy all files that start with  "package" and finish with ".json"
# COPY package*.json ./

# One by one
COPY package.json ./
COPY package-lock.json ./

RUN npm install

# Copy all files in /app
COPY . .

# Directly the file
# CMD [ "node","src/index.js" ]

# Using scripts in package.json
CMD [ "npm", "run", "start:dev" ]