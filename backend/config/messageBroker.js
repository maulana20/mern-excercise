const amqp = require('amqplib');

const connect = async () => {
  try {
    const connection = await amqp.connect("amqp://user:password@rabbitmq:5672");
    const channel = await connection.createChannel();
    console.log("RabbitMQ Connected...");
    return channel;
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const consume = async () => {
  try {
    connect().then(channel => {
      channel.assertQueue('notification', { durable: false });
      channel.consume('notification', msg => console.log('- Received', msg.content.toString()), { noAck: true });
    });
    console.log("RabbitMQ Consume...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = {
  connect: connect,
  consume: consume
}
