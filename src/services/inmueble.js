const { Inmueble } = require('../models/Inmueble');
const Validator = require('../helpers/dao/Validator');

exports.createInmueble = ({
  datosPrincipales,
  caracteristicas,
  multimedia,
}) => new Promise((resolve) => {
  try {
    const validator = new Validator();
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
    });
    inmuebleInstance.save((err) => {
      if (err) return resolve({ error: err });
      return resolve({ success: true, inmueble: inmuebleInstance });
    });
  } catch (error) {
    return resolve({ error });
  }
});

exports.readInmueble = () => {

};

exports.updateInmueble = () => {

};

exports.deleteInmueble = () => {

};
