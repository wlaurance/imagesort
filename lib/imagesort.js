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
    program.version(JSON.parse(data).version).option('-i, --filesjson [file]', 'files.json', './files.json').option('-d, --dir [dir]', 'directory of images to check', './').parse(process.argv);
    program.dir = checkDir(program.dir);
    return fs.readFile(program.filesjson, function(e, d) {
      var errors, files, iterator;
      if (e != null) throw e;
      try {
        files = (JSON.parse(d)).files;
        errors = 0;
        iterator = function(file, cb) {
          var uri;
          uri = program.dir + file.name;
          return fs.readFile(uri, function(fe, fdata) {
            var info, msg;
            if (fe != null) console.log(("Missing " + file.name).bold.red);
            if (fe != null) errors++;
            if (fe != null) cb();
            if (!(fe != null)) {
              info = imageinfo(fdata);
              msg = file.name + '\t';
              if (info.width === file.width) {
                msg += ' Width:' + info.width + ' ✔'.green;
              } else {
                msg += ' Width:' + file.width + " != " + info.width + ' ✗'.red;
                errors++;
              }
              msg += '\n\t\t';
              if (info.height === file.height) {
                msg += ' Height:' + info.height + ' ✔'.green;
              } else {
                msg += ' Height:' + file.height + " != " + info.height + ' ✗'.red;
                errors++;
              }
              console.log(msg);
              return cb();
            }
          });
        };
        return async.forEach(files, iterator, function(error) {
          if (error != null) throw error;
          if (errors === 0) {
            return console.log(('All of your images have the required width and height specified in ' + program.filesjson).green);
          } else {
            return console.log(('You fail. You have ' + errors + " error(s). Please fix them and try again").red);
          }
        });
      } catch (e) {
        throw e;
        return process.exit();
      }
    });
  });

}).call(this);
