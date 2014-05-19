var jade = require('jade');

module.exports = function(entries) {
  return function(req, res) {
    jade.renderFile(__dirname + '/main.jade', { entries: entries }, function(err, html) {
      if (err) {
        res.writeHeader(500);
        return res.end(err.toString());
      }

      res.writeHeader(200, { 'Content-Type': 'text/html' });
      res.end(html);
    });
  };
};
