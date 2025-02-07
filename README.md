# PSM API

# Requirement:

    Node : 16.17
    PORT : 4444

# Step For Run Application :

    - npm i
    - npm run build
    - NODE_ENV=dev npm start & - for run background

# Step - for use pm2

    - sudo npm install pm2 -g
    - npm run build
    - NODE_ENV=dev npm run pm2

# Step - For use Docker

    Requirement :  docker
        1. docker-compose down
        2. docker-compose build
        3. docker-compose up

docker build -t psm_backend .

docker run -p 4444:4444 my-node-app



docker-compose up

docker-compose logs node

docker-compose ps


docker-compose logs mysql


docker build -t backend .

docker run -d -p 4444:80 backend

docker-compose down -v
docker-compose up --build



docker-compose build

docker-compose up --build