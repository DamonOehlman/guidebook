var jade = require('jade');

module.exports = function(entry) {
  return function(req, res) {
    jade.renderFile(__dirname + '/entry.jade', { entry: entry }, function(err, html) {
      if (err) {
        res.writeHeader(500);
        return res.end(err.toString());
      }

      res.writeHeader(200, { 'Content-Type': 'text/html' });
      res.end(html);
    });
  };
};
