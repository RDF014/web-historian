var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelpers = require('../web/http-helpers.js');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  httpHelpers.methods[req.method](req, res);
};
