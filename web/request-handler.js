var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var contents = '';
  fs.readFile(archive.paths.index, "utf-8", function(err, data) {
    if (err) {
      // console.log(err);
    } else {
      // console.log(data);
      contents += data;
    }
  });
  // res.end('/<input/');
  res.end(archive.paths.index);
};
