const mongoose = require('mongoose');

const connect = async () => {
  try {
    await mongoose.connect(`mongodb://${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`, {
      useNewUrlParser: true
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const open = async () => {
  try {
    await mongoose.connection.once('open', () => {
      console.log("MongoDB database connection established successfully");
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = {
  connect: connect,
  open: open
}
