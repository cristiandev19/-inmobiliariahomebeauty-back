const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { config } = require('../config/index');
const User = require('../models/User');

const opts = {
  jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey    : config.jwtSecretKey, // normally store this in process.env.secret
};

// Aqui debemos cambiarlo para que llame a la BD por un id dentro del token
module.exports = new JwtStrategy(opts, async (jwtPayload, done) => {
  User.findOne({ _id: jwtPayload.sub }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  });
});
