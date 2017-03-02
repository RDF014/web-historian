var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers.js');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
};



// As you progress, keep thinking about what helper functions you can put here!
var sendResponse = function(response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, exports.headers);
  response.end(data);
};

var collectData = function(request, callback) {
  var url = '';
  request.on('data', function(data) {
    url += data;
    url = url.slice(4);
  });
  request.on('end', function() {
    archive.addUrlToList(url, function() {
      callback(url);
    });
  });
};

exports.methods = {
  'POST': function(request, response) {
    collectData(request, function(url) {
      sendResponse(response, url, 302);
    });
  },
  'GET': function(request, response) {
    if (request.url === '/') {
      sendResponse(response, '/<input/');  // REVIST, ARE WE RETURNING THE RIGHT URL?!
    }
    archive.isUrlArchived(request.url, function(bool) {
      if (!bool) {
        sendResponse(response, 'Not found', 404);
      } else {
        sendResponse(response, request.url);
      }
    });
  },
  'OPTIONS': function(request, response) {

  }
};


