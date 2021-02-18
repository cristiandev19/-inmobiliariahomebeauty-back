const mongoose = require('mongoose');
const { config } = require('../config/index');

const dbConnection = async () => {
  try {
    await mongoose.connect( config.mongoConnect, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (error) {
    throw new Error('Algo salio mal en la coneccion a mongo')
  }
};

module.exports = {
  dbConnection,
};
