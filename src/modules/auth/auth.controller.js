const passport = require('passport');
const User = require("../../models/User");
const auth_utils = require('./auth.utils');
// const

exports.emailLogin = async (req, res, next) => {
  try {
    console.log('res', req.body);
    const { email, password } = req.body;
    const [user] = await User.find({ email });

    if (!user) {
      throw new Error('El usuario no existe');
    }

    console.log('user', user);
    const tokenObject = auth_utils.signToken(user);
    const { names, lastNames } = user;
    const userObj = {
      names,
      lastNames,
      email
    };

    return res.status(200).json({
      success   : true,
      user      : userObj,
      token     : tokenObject.token,
      expiresIn : tokenObject.expires
    });
  } catch (error) {
    return next(error);
  }
}

exports.emailSignup = (req, res, next) => {
  try {
    const { names, lastNames, email, password } = req.body;
    const user = new User({ names, lastNames, email, password });
    user.save();
    console.log('user', user)
    return res.status(200).send({
      message: 'Funciono'
    })
  } catch (error) {
    return next(error);
  }
}

exports.protected = (req, res, next) => {
  try {

    // ahora tenemos el req.user  con la informacion del usuario
    return res.status(200).send({
      message: 'Funciono estas autentificado'
    })
  } catch (error) {
    return next(error);
  }
}

// const userSchema = new mongoose.Schema({
//   names              : String,
//   lastNames          : String,
//   email              : { type: String, unique: true },
//   password           : String,
//   // Cuando quieres cambiar la contraseña, se usa el Token
//   passwordResetToken : String,
//   emailVerified      : Boolean
// }, { timestamps: true });


