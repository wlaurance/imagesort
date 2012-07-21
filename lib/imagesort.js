(function() {
  var async, checkDir, colors, fs, imageinfo, program;

  fs = require('fs');

  imageinfo = require('imageinfo');

  program = require('commander');

  colors = require('colors');

  async = require('async');

  checkDir = function(str) {
    if (str[str.length - 1] !== '/') {
      return str += '/';
    } else {
      return str;
    }
  };

  fs.readFile(__dirname + '/../package.json', function(error, data) {
    if (error != null) throw error;
    program.version(JSON.parse(data).version).option('-d, --dir [dir]', 'directory of images to copy', './').parse(process.argv);
    return program.dir = checkDir(program.dir);
  });

}).call(this);
