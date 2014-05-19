var async = require('async');
var fs = require('fs');
var path = require('path');
var toc = require('altpub-toc');

/**
  # guidebook

  The `guidebook` module (and CLI) is a simple way to enable interaction with
  your markdown sources for a [leanpub](https://leanpub.com) authored books
  with an interactive guidebook.  This approach has been developed for working
  with the [rtc.io](http://rtc.io/) modules and as such uses a browser based
  interface.

  ## Why?

  Because I don't like doing things more than once, and it seemed like most of
  the component pieces were available to make this possible.

  ## Usage

  Once you have installed guidebook on your local machine, then you should be
  able to run the `guidebook` command in a leanpub compatible folder.

**/

module.exports = function(opts) {
  var cdn = require('browserify-cdn');

  // initialise the basepath
  var basePath = (opts || {}).basePath || process.cwd();
  var bookPath = path.resolve(basePath, 'manuscript');

  toc.load(path.join(bookPath, 'Book.txt'), function(err, entries) {
  });
};
