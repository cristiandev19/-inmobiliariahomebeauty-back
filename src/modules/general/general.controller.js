const inmuebleService = require('../../services/inmueble');

exports.getInmuebles = async (req, res, next) => {
  try {
    const {
      success, inmuebles, error, message,
    } = await inmuebleService.readInmuebles();
    if (error) {
      throw new Error(message);
    }

    return res.status(200).send({
      inmuebles,
      success,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getInmueble = async (req, res, next) => {
  try {
    const { _id } = req.query;
    const {
      success, inmuebles, error, message,
    } = await inmuebleService.readInmueble(_id);
    if (error) {
      throw new Error(message);
    }

    return res.status(200).send({
      success,
      inmueble: inmuebles[0],
    });
  } catch (error) {
    return next(error);
  }
};
