/* eslint-disable no-param-reassign */
const { Inmueble } = require('../models/Inmueble');
const Validator = require('../helpers/dao/Validator');

exports.createInmueble = ({
  datosPrincipales,
  caracteristicas,
  multimedia,
  registerUser,
}) => new Promise((resolve) => {
  try {
    const validator = new Validator();

    if (!registerUser) {
      validator.setMessage('Es obligatorio que exista un usuario registrado.');
    }

    multimedia.map((m) => {
      if (!m.urlMultimedia || !m.extensionMultimedia) {
        validator.setMessage('Error con un archivo multimedia.');
      }
      return {
        ...m,
      };
    });

    if (validator.isInvalid()) {
      throw new Error(validator.message);
    }

    const inmuebleInstance = new Inmueble({
      datosPrincipales,
      caracteristicas,
      multimedia,
      registerUser,
    });
    inmuebleInstance.save((err) => {
      if (err) return resolve({ error: err });
      return resolve({ success: true, inmueble: inmuebleInstance });
    });
  } catch (error) {
    return resolve({ error });
  }
});

exports.readInmuebles = () => new Promise((resolve) => {
  try {
    Inmueble
      .find({})
      .exec((err, inmuebles) => {
        if (err) {
          return resolve({ error: err });
        }
        return resolve({ success: true, inmuebles });
      });
  } catch (error) {
    return resolve({ error });
  }
});

exports.readInmueble = (_id) => new Promise((resolve) => {
  try {
    Inmueble
      .find({ _id })
      .exec((err, inmuebles) => {
        if (err) {
          return resolve({ error: err });
        }
        return resolve({ success: true, inmuebles });
      });
  } catch (error) {
    return resolve({ error });
  }
});

exports.updateInmueble = ({
  idInmueble,
  datosPrincipales,
  caracteristicas,
  multimedia,
  registerUser,
}) => new Promise((resolve) => {
  try {
    Inmueble.findOneAndUpdate({
      _id: idInmueble,
    }, {
      $set: {
        datosPrincipales,
        caracteristicas,
        multimedia,
        registerUser,
      },
    }, { upsert: true }, (err, inmueble) => {
      if (err) {
        return resolve({ error: err });
      }
      return resolve({ success: true, inmueble });
    });
  } catch (error) {
    return resolve({ error });
  }
});

exports.deleteInmueble = () => {

};
