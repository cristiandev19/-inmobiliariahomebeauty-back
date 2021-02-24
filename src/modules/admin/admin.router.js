const express = require('express');

const router = express.Router();

const adminController = require('./admin.controller');

// middleware that is specific to this router
router.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('Time: ', Date.now());
  next();
});

router
  .post('/uploadFile', adminController.uploadFile)
  .post('/create-inmueble', adminController.createInmueble);

module.exports = router;
