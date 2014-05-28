var express = require('express');
var cors = require('cors');
var bundler = require('browserify-cdn/bundler/');
var defaults = require('browserify-cdn/defaults');
var multiple = require('browserify-cdn/multiple');
var path = require('path');

module.exports = function(opts) {
  var app = express();
  var basePath = (opts || {}).basePath || __dirname;
  var bundle = bundler(defaults({
    db: path.join(basePath, 'cdn.db'),
    root: path.join(basePath, 'tmp')
  }));

  app.use(app.routes);
  app.use(cors());
  multiple(app, bundle);

  return app;
};
