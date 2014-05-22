var async = require('async');
var brucedown = require('brucedown');
var marked = require('marked');
var debug = require('debug')('guidebook');
var express = require('express');
var fs = require('fs');
var path = require('path');
var parseSections = require('altpub-sections');
var toc = require('altpub-toc');
var gendocs = require('gendocs');
var http = require('http');
var out = require('out');

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

  ## Included Fonts

  Please note that the guidebook default rendering and installable module
  includes the following fonts sourced from
  [Google Fonts](http://www.google.com/fonts):

  - Inconsolata (Ralph Levein - SIL Open Font License, 1.1)
  - Roboto Slab (Christian Robertson - Apache 2.0)
  - Source Code Pro (Paul D. Hunt  - SIL Open Font License, 1.1)

  Fonts are distributed under their original licenses.

**/

module.exports = function(opts, callback) {
  var cdn = require('browserify-cdn');
  var server;

  // initialise the basepath
  var basePath = (opts || {}).basePath || process.cwd();
  var bookPath = path.resolve(basePath, 'manuscript');
  var port = (opts || {}).port || process.env.NODE_PORT || 3000;

  function createServer(entries, callback) {
    cdn.app.use('/guidebook', require('./pages/router.js')(entries, bookPath, opts).middleware);
    cdn.app.use('/guidebook', express.static(__dirname + '/public'));
    debug('creating server to serve ' + entries.length + ' entries');

    callback(null, http.createServer(cdn.app), cdn);
  }

  function genDocs(entries, callback) {
    async.map(entries, genDocsForEntry, function(err, entries) {
      debug('completed generating docs for ' + entries.length + ' entries');
      callback(err, entries);
    });
  }

  function genDocsForEntry(entry, callback) {
    reloadEntry({
      name: entry,
      filename: path.join(bookPath, entry)
    }, callback);
  }

  function reloadEntry(entry, callback) {
    fs.readFile(entry.filename, { encoding: 'utf8' }, function(err, content) {
      if (err) {
        return callback(err);
      }

      debug('running gendocs for file: ' + entry.name);
      gendocs({ input: content, cwd: bookPath }, function(err, markdown) {
        debug('gendocs complete for file: ' + entry.name);

        // set the markdown for the entry
        entry.markdown = markdown;

        // generate the html
        entry.html = markdown && marked(parseSections(markdown));

        // trigger the callback
        callback(err, entry);
      });
    });
  }

  function watchContent(entries, callback) {
    // setup all the watchers
    entries.forEach(function(entry) {
      var timer;

      fs.watch(entry.filename, function(evt, filename) {
        if (evt === 'change') {
          clearTimeout(timer);
          timer = setTimeout(function() {
            reloadEntry(entry, function() {});
          }, 10);
        }
      });
    });

    callback(null, entries);
  }

  async.waterfall([
    function(callback) {
      callback(null, path.join(bookPath, 'Book.txt'));
    },

    toc.load,
    genDocs,
    watchContent,
    createServer
  ], callback || function() {});
};
