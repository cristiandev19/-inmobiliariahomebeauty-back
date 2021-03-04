const express = require('express');

const router = express.Router();

const generalController = require('./general.controller');

// middleware that is specific to this router
router.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('Time: ', Date.now());
  next();
});

// router.use(passport.authenticate('jwt', { session: false }));

router
  .get('/get-inmuebles', generalController.getInmuebles)
  .get('/get-inmueble', generalController.getInmueble);
module.exports = router;
