var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt'),
  index: path.join(__dirname, '../web/public/index.html')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(this.paths.list, 'utf-8', function(err, data) {
    if (err) {
      throw err;
    } else {
      var urlArray = data.split('\n');
      callback(urlArray);
    }
  });
};

exports.isUrlInList = function(url, callback) {
  this.readListOfUrls(function (urlArray) {
    var urlIndex = urlArray.indexOf(url);
    if (urlIndex === -1) {
      callback(false);
    } else {
      callback(true);
    }
  });  
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(this.paths.list, url + '\n', (err) => { 
    if (err) {
      throw err;
    }
    callback(url); 
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.access(`${this.paths.archivedSites}/${url}`, function(err) {
    if (err) {
      callback(false);
    } else {
      callback(true);
    }
  });
};

exports.assets = {
  '/': path.join(this.paths.siteAssets, 'index.html'),
  '/loading.html': path.join(this.paths.siteAssets, 'loading.html'),
  '/styles.css': path.join(this.paths.siteAssets, 'styles.css')
};

exports.downloadUrls = function(urls) {
  urls.forEach(function(url) {
    var directory = path.join(exports.paths.archivedSites, url);
    console.log('DIRECTORY: ', directory);
    console.log('URL: ', url);
    exports.assets[url] = directory;
    var options = {host: url};
    var html = '';
    http.get(options, function(response) {
      response.on('data', function(chunk) {
        html += chunk;
      });
      response.on('end', function() {
        fs.writeFile(directory, html, function(err) {
          if (err) {
            throw err;
          }
        });
      });
    });
  });
};
