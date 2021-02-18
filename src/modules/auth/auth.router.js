const express = require('express');
const router = express.Router();

// //passport stuff
const passport      = require('passport');


const auth_controller = require('./auth.controller');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Auth Time: ', Date.now());
  next();
});

router
.post('/email-login', auth_controller.emailLogin)
.post('/email-signup', auth_controller.emailSignup)
.get('/protected', passport.authenticate('jwt', { session: false }), auth_controller.protected);

module.exports = router;