const amqp = require('amqplib');
let connection;

function connect() {
  return amqp.connect('amqp://localhost').then(con => {
    connection = con;
    return connection;
  })
}

function sendToQueue(queue, content) {
  return connection.createChannel().then(channel => {
    return channel.assertQueue(queue,{durable: false}).then(ok => {
      channel.sendToQueue(queue,new Buffer(content));
      return channel.close();
    })
  })  
}

module.exports = {
  connect,
  sendToQueue
}