const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();

const publisher = async (data) => {
  try {
    pubsub.topic(process.env.GOOGLE_PUBLISHER_MESSAGE).publishMessage({
     data: data,
     attributes: { key: process.env.GOOGLE_PUBLISHER_KEY }
   });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const subscriber = async (socket) => {
  try {
    pubsub.subscription(process.env.GOOGLE_SUBCRIBER_MESSAGE).on("message", (message) => {
      if (isJson(message.data)) {
        if (message.attributes.key === process.env.GOOGLE_PUBLISHER_KEY) {
          socket.emit('notification', String.fromCharCode.apply(null, new Uint8Array(message.data)));
        } else {
          if (!JSON.parse(message.data).message) return false;
          pubsub.subscription(process.env.GOOGLE_SUBCRIBER_KEY).on("message", (msg) => {
            socket.emit('notification', JSON.stringify({
              message: JSON.parse(message.data).message,
              key: JSON.parse(msg.data).key
            }));
          });
        }
      }
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const isJson = (str) => {
  try {
   JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

module.exports = {
  publisher: publisher,
  subscriber: subscriber
}
