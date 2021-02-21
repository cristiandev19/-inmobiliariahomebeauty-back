const authUtils = require('./auth.utils');
const User = require('../../models/User');
// const

exports.emailLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [user] = await User.find({ email });

    if (!user) {
      throw new Error('El usuario no existe');
    }

    const { error, isMatch, message } = await user.comparePassword(password);

    if (error) {
      throw new Error(message);
    }
    if (!isMatch) {
      throw new Error(message);
    }

    const tokenObject = authUtils.signToken(user);
    const { profile } = user;
    const userObj = {
      profile,
      email,
    };
    return res.status(200).json({
      success   : true,
      user      : userObj,
      token     : tokenObject.token,
      expiresIn : tokenObject.expires,
    });
  } catch (error) {
    return next(error);
  }
};

exports.emailSignup = (req, res, next) => {
  try {
    const {
      names, lastNames, email, password,
    } = req.body;
    const profile = {
      names,
      lastNames,
    };
    const user = new User({ email, password, profile });

    user.save();
    return res.status(200).send({
      message: 'Funciono',
    });
  } catch (error) {
    return next(error);
  }
};

exports.protected = (req, res, next) => {
  try {
    // ahora tenemos el req.user  con la informacion del usuario
    return res.status(200).send({
      message: 'Funciono estas autentificado',
    });
  } catch (error) {
    return next(error);
  }
};

// const userSchema = new mongoose.Schema({
//   names              : String,
//   lastNames          : String,
//   email              : { type: String, unique: true },
//   password           : String,
//   // Cuando quieres cambiar la contraseña, se usa el Token
//   passwordResetToken : String,
//   emailVerified      : Boolean
// }, { timestamps: true });
