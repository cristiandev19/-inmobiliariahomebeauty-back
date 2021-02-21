const jwt = require('jsonwebtoken');
const ms = require('ms');
const { config } = require('../../config/index');

exports.signToken = (user, secret = config.authJwtSecret) => {
  const { _id } = user;
  const expiresIn = config.authJwtExpireTime;

  const payload = {
    sub : _id,
    iat : Date.now(),
  };
  const signedToken = jwt.sign(payload, secret, {
    expiresIn,
  });
  return {
    token   : `Bearer ${signedToken}`,
    expires : ms(expiresIn),
  };
};

exports.verifyToken = (token, secret = config.authJwtSecret) => {
  try {
    const verified = jwt.verify(token, secret);
    return {
      msj     : 'Autentificado con exito',
      payload : verified,
    };
  } catch (error) {
    return {
      msj: error.message || 'Problemas al verificar el token',
      error,
    };
  }
};
