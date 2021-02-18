const express = require('express');

const router = express.Router();

// //passport stuff
const passport      = require('passport');
const authController = require('./auth.controller');

// middleware that is specific to this router
router.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('Auth Time: ', Date.now());
  next();
});

router
  .post('/email-login', authController.emailLogin)
  .post('/email-signup', authController.emailSignup)
  .get('/protected', passport.authenticate('jwt', { session: false }), authController.protected);

module.exports = router;
