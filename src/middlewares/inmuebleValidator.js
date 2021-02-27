const {
  DatosPrincipales,
  Caracteristicas,
} = require('../models/Inmueble');

exports.createInmuebleValidator = (req, res, next) => {
  const {
    datosPrincipales,
    caracteristicas,
  } = req.body;

  const datosPrincipalesInstance = new DatosPrincipales(datosPrincipales);
  const caracteristicasInstance = new Caracteristicas(caracteristicas);

  const datosPrincipalesErrors = datosPrincipalesInstance.validateSync();
  if (datosPrincipalesErrors) {
    return res.status(400).send({
      message: 'Campo faltante en datos principales',
    });
  }
  const caracteristicasErrors = caracteristicasInstance.validateSync();

  if (caracteristicasErrors) {
    return res.status(400).send({
      message: 'Campo faltante en caracteristicas',
    });
  }

  next();
};
