var jade = require('jade');

module.exports = function(entry, entries) {
  return function(req, res) {
    var data = {
      entries: entries,
      entry: entry
    };

    jade.renderFile(__dirname + '/entry.jade', data, function(err, html) {
      if (err) {
        res.writeHeader(500);
        return res.end(err.toString());
      }

      res.writeHeader(200, { 'Content-Type': 'text/html' });
      res.end(html);
    });
  };
};
