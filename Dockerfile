# BASE IMAGE WITH VERSIONING
FROM node:16

# SOURCE CODE WILL MOVE INTO "app" DIRECTORY
WORKDIR /app

# COPY FILE INTO CURRENT DIR (/app)
COPY package.json .

# RUN FOR EXECUTE DEPEDENCIES
RUN npm install

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
      then npm install; \
      else npm install --only=production; \
    fi

# COPY ALL FILES INTO DIR
COPY . ./

# TO TELL PORT SHOULD BE OPEN
# WAY 1
ENV PORT 3000
EXPOSE $PORT

# WAY 2
EXPOSE 3000

# COMMAND FOR RUNNING APP
# CMD ["npm", "run", "dev"] -> FOR DEVELOPMENT 
CMD ["node", "index.js"]