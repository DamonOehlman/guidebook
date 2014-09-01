var browserify = require('browserify');
var express = require('express');

module.exports = function(entries, bookPath, opts) {
  var router = new express.Router();

  // index
  router.get('/', require('./main')(entries, bookPath, opts));

  // page for each of the entries
  entries.forEach(function(entry) {
    router.get('/' + entry.name, require('./entry')(entry, entries, bookPath, opts));
  });

  router.get('/guidebook.js', function(req, res) {
    var b = browserify(__dirname + '/../public/guidebook.js', { debug: true });

    res.writeHead(200, {
      'Content-Type': 'application/javascript'
    });

    b.bundle().pipe(res);
  });

  return router;
};
