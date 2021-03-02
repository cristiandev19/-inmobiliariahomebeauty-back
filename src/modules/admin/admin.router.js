const express = require('express');

const passport = require('passport');

const router = express.Router();

const adminController = require('./admin.controller');

const { createInmuebleValidator } = require('../../middlewares/inmuebleValidator');

// middleware that is specific to this router
router.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('Time: ', Date.now());
  next();
});

// router.use(passport.authenticate('jwt', { session: false }));

router
  .post('/uploadFile', adminController.uploadFile)
  .post('/create-inmueble', passport.authenticate('jwt', { session: false }), createInmuebleValidator, adminController.createInmueble)
  .get('/get-inmuebles', passport.authenticate('jwt', { session: false }), adminController.getInmuebles)
  .get('/get-inmueble', passport.authenticate('jwt', { session: false }), adminController.getInmueble);
module.exports = router;
