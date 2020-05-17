FROM node:latest

# Create app directory
WORKDIR /home/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
RUN mkdir cache
RUN mkdir content
COPY content/* ./content/
COPY .env ./
COPY *.js ./

# need to change owner of cache to be able to write afterwards
RUN chown node:node cache
RUN chown node:node content
# We are going to run as user node, not admin
USER node

EXPOSE 3000
CMD [ "node", "server.js" ]