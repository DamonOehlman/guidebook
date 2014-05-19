var async = require('async');
var brucedown = require('brucedown');
var debug = require('debug')('guidebook');
var fs = require('fs');
var path = require('path');
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

**/

module.exports = function(opts) {
  var cdn = require('browserify-cdn');
  var server;

  // initialise the basepath
  var basePath = (opts || {}).basePath || process.cwd();
  var bookPath = path.resolve(basePath, 'manuscript');
  var port = (opts || {}).port || process.env.NODE_PORT || 3000;

  function createServer(entries, callback) {
    cdn.app.use('/guidebook', require('./pages/router.js')(entries, bookPath, opts).middleware);
    debug('creating server to serve entries: ', entries);

    callback(null, http.createServer(cdn.app));
  }

  function genDocs(entries, callback) {
    async.map(entries, genDocsForEntry, function(err, entries) {
      debug('completed generating docs for all entries', err, entries);
      callback(err, entries);
    });
  }

  function genHTML(entries, callback) {
    async.map(
      entries,
      function(entry, itemCb) {
        brucedown(entry.markdown, function(err, html) {
          entry.html = err ? '' : html;
          itemCb(err, entry);
        })
      },
      callback
    );
  }

  function genDocsForEntry(entry, callback) {
    fs.readFile(path.join(bookPath, entry), { encoding: 'utf8' }, function(err, content) {
      if (err) {
        return callback(err);
      }

      debug('running gendocs for file: ' + entry);
      gendocs({ input: content, cwd: bookPath }, function(err, markdown) {
        debug('gendocs complete for file: ' + entry);
        callback(err, {
          name: entry,
          markdown: markdown
        });
      });
    });
  }

  function handleInitComplete(err, server) {
    var addr = (!err) && server.address();

    if (err) {
      return out.error(err);
    }

    out('server running at: http://{0}:{1}/guidebook/', addr.address, port);
  }

  function startServer(server, callback) {
    server.listen(port, function(err) {
      callback(err, server);
    });
  }

  async.waterfall([
    function(callback) {
      callback(null, path.join(bookPath, 'Book.txt'));
    },

    toc.load,
    genDocs,
    genHTML,
    createServer,
    startServer
  ], handleInitComplete);
};
