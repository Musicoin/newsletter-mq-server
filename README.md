## install rabbitmq

### install with apt-get
...

### install with docker
sudo docker pull rabbitmq
sudo docker run -d -e RABBITMQ_NODENAME=musicoin-rabbit --name musicoin-rabbit -p 5672:5672 rabbitmq

## Change .env

cp .env.default .env

Replace environment variables in .env


## run consumer server
npm start
