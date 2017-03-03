var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelpers = require('../web/http-helpers.js');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  // if (req.method === 'GET' && req.url === '/') {
  //   fs.readFile(path.join(archive.paths.siteAssets, 'index.html'), 'utf-8', function(err, data) {
  //     if (err) { throw err; } 
  //     res.writeHead(200, httpHelpers.headers);
  //     console.log(data);
  //     res.end(data);
  //   });
  // }
  // if (req.method === 'GET' && req.url === '/styles.css') {
  //   fs.readFile(path.join(archive.paths.siteAssets, 'styles.css'), 'utf-8', function(err, data) {
  //     if (err) { throw err; } 
  //     res.writeHead(200, httpHelpers.headers);
  //     console.log(data);
  //     res.end(data);
  //   });
  // }
  httpHelpers.methods[req.method](req, res);
};
