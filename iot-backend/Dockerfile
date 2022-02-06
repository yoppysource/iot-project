FROM node:15.4

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

CMD npm run start:dev

# update image used by a deployment

# 1. The deploymnent must be using the 'latest' tag in the pod spec section
# 2. Make an update to your code
# 3. build the image
# ex) docker build -t livfarm/planters .
# 4. push the image to docker hub
# ex) docker push livfarm/planters
# 5. Run the command kubectl rollout restart deployment <depl_name>