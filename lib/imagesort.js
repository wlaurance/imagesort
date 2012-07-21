(function() {
  var async, checkDir, colors, findAndReplace, fs, imageinfo, program, spawn;

  fs = require('fs');

  imageinfo = require('imageinfo');

  program = require('commander');

  colors = require('colors');

  async = require('async');

  spawn = require('child_process').spawn;

  checkDir = function(str) {
    if (str[str.length - 1] !== '/') {
      return str += '/';
    } else {
      return str;
    }
  };

  fs.readFile(__dirname + '/../package.json', function(error, data) {
    var inputFileArray, ls;
    if (error != null) throw error;
    program.version(JSON.parse(data).version).option('-d, --dir [dir]', 'directory of images to copy', './').option('-o, --output [dir]', 'directory you want them to replace', './android/images/').parse(process.argv);
    program.dir = checkDir(program.dir);
    program.output = checkDir(program.output);
    inputFileArray = [];
    ls = spawn('ls', [program.dir]);
    return ls.stdout.on('data', function(d) {
      var cpfiles, iterator;
      cpfiles = d.toString().split('\n');
      iterator = function(file, cb) {
        if (file.indexOf('.png') !== -1) {
          return fs.readFile(program.dir + file, function(error, bytes) {
            if (error != null) throw error;
            inputFileArray.push({
              filename: program.dir + file,
              imginfo: imageinfo(bytes)
            });
            return cb();
          });
        } else {
          return cb();
        }
      };
      return async.forEach(cpfiles, iterator, function(error) {
        if (error != null) throw error;
        return findAndReplace(inputFileArray);
      });
    });
  });

  findAndReplace = function(inputFileArray) {
    var find;
    find = spawn('find', [program.output]);
    return find.stdout.on('data', function(d) {
      var iterator, potential;
      potential = d.toString().split('\n');
      iterator = function(file, cb) {
        if (file.indexOf('.png') !== -1) {
          return fs.readFile(file, function(error, bytes) {
            var cp, info, myfile, _i, _len, _results;
            info = imageinfo(bytes);
            _results = [];
            for (_i = 0, _len = inputFileArray.length; _i < _len; _i++) {
              myfile = inputFileArray[_i];
              if (info.height === myfile.imginfo.height && info.width === myfile.imginfo.width) {
                console.log('cp ' + myfile.filename + ' ' + file);
                cp = spawn('cp', [myfile.filename, file]);
                cp.on('exit', function() {
                  return cb();
                });
                break;
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          });
        }
      };
      return async.forEach(potential, iterator, function(err) {
        if (err != null) throw err;
        return console.log('done');
      });
    });
  };

}).call(this);
