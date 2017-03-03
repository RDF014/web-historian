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
  fs.readFile(asset, 'utf-8', function(err, data) {
    if (err) { throw err; } 
    callback(data);
  });
};

var assets = {
  '/': path.join(archive.paths.siteAssets, 'index.html'),
  '/loading.html': path.join(archive.paths.siteAssets, 'loading.html'),
  '/styles.css': path.join(archive.paths.siteAssets, 'styles.css')
};



// As you progress, keep thinking about what helper functions you can put here!
var sendResponse = function(response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, exports.headers);
  response.end(data);
};

var collectData = function(request, response, callback) {
  var url = '';
  request.on('data', function(data) {
    url += data;
    url = url.slice(4);
  });
  request.on('end', function() {
    archive.isUrlArchived(url, function(bool) {
      if (bool) {
        exports.methods.GET({url: url}, response);
        // exports.serveAssets(response, assets[url], function(data) { // is in assets obj from downloadUrl
        //   sendResponse(response, data); 
        // });
      } else {
        // not archived
        archive.isUrlInList(url, function(bool) {
          if (bool) {
            exports.methods.GET({url: '/loading.html'}, response, 302);
            // exports.serveAssets(response, assets['/loading.html'], function(data) { 
            //   sendResponse(response, data, 302); 
            // });
          } else {
            // not in list
            archive.addUrlToList(url, function(url) {
              exports.methods.GET({url: '/loading.html'}, response, 302);
              // exports.serveAssets(response, assets['/loading.html'], function(data) { 
              //   sendResponse(response, data, 302); 
              // });
            });
          }
        });
      }
    });
  });
};

exports.methods = {
  'POST': function(request, response) {
    // archive.isUrlArchived(request.url, function(bool) {
    //   if (!bool) {
    //     sendResponse(response, 'Not found', 404);
    //   } else {
    //     exports.methods.GET(request, response);
    //     // sendResponse(response, request.url);
    //   }
    // });

    collectData(request, response, function(url) {
      sendResponse(response, url, 302);
    });
  },
  'GET': function(request, response, statusCode) {
    statusCode = statusCode || 200;
    exports.serveAssets(response, assets[request.url], function(data) {
      sendResponse(response, data, statusCode); 
    });
  },
  'OPTIONS': function(request, response) {

  }
};


