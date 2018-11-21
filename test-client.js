const rabbitMQ = require('./rabbitMQ');
const Letter = require('./db/models/news-letter');
const addresses = [];
const subject = "test";
const html = "hello";
const status = "penging";
for (let index = 0; index < 10000; index++) {
  addresses.push('test@quseit.com');
}

async function start() {
  await rabbitMQ.connect();

  const letter = await insert();
  await rabbitMQ.sendToQueue('email', letter._id.toString());
  console.log("complete.");
}

function insert() {
  const letter = new Letter({
    subject,
    html,
    status,
    addresses
  });
  return letter.save();
}

start();
