var express = require('express');

module.exports = function(entries, opts) {
  var router = new express.Router();

  // index
  router.get('/', require('./main')(entries, opts));

  // page for each of the entries
  entries.forEach(function(entry) {
    router.get('/' + entry, require('./entry')(entry, opts));
  });

  return router;
};
