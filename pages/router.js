var express = require('express');

module.exports = function(entries, bookPath, opts) {
  var router = new express.Router();

  // index
  router.get('/', require('./main')(entries, bookPath, opts));

  // page for each of the entries
  entries.forEach(function(entry) {
    router.get('/' + entry.name, require('./entry')(entry, bookPath, opts));
  });

  return router;
};
