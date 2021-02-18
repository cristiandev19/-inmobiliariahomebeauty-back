const express = require('express');
const router = express.Router();

const admin_controller = require('./admin.controller');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router
.post('/uploadFile', admin_controller.uploadFile);

module.exports = router;