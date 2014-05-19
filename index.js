var async = require('async');
var fs = require('fs');
var path = require('path');
var toc = require('altpub-toc');

module.exports = function(opts) {
  var cdn = require('browserify-cdn');

  // initialise the basepath
  var basePath = (opts || {}).basePath || process.cwd();
  var bookPath = path.resolve(basePath, 'manuscript');

  toc.load(path.join(bookPath, 'Book.txt'), function(err, entries) {
  });
};
