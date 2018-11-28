require('dotenv').config();
const amqp = require('amqplib');
const largeSend = require('./utils/email').largeSend;
const Letter = require('./db/models/news-letter');

const queue = "email";
amqp.connect(process.env.RABBITMQ_SERVER).then(conn => {
  process.once('SIGINT', conn.close.bind(conn));
  return conn.createChannel().then(ch => {
    ch.prefetch(1);

    function _handleMessage(message) {
      handleMessage(ch, message);
    }

    return ch.assertQueue(queue, {
      durable: false
    }).then(() => {
      ch.consume(queue, _handleMessage, {
        noAck: false
      });
    }).then(() => {
      console.log('[*] Waiting for message. To exit press CRTL+C');
    });;

  });
}).catch(error => {
  console.log("error: ", error.message)
});

async function handleMessage(channel, message) {
  console.log("task start:", message.content.toString());

  try {
    const id = message.content.toString();
    const letter = await Letter.findOne({
      _id: id
    }).exec();

    const subject = letter.subject;
    const html = letter.html;
    const addresses = letter.addresses;
    const emails = addresses.map(address => {
      return {
        subject,
        html,
        from: 'support@musicoin.org',
        to: address
      }
    });

    const issues = await largeSend(emails);
    letter.issues = issues;
    letter.status = "sended";
    await letter.save();
    channel.ack(message);
    console.log("task complete.");
  } catch (error) {
    console.log("error:", error.message);
    channel.nack(message)
  }
}