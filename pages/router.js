var express = require('express');

module.exports = function(entries) {
  var router = new express.Router();

  router.get('/', require('./main')(entries));

  return router;
};
