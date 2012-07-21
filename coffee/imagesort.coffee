fs = require 'fs'
imageinfo = require 'imageinfo'
program = require 'commander'
colors = require 'colors'
async = require 'async'
spawn = require('child_process').spawn


checkDir = (str)->
  if str[str.length - 1] isnt '/'
    return str += '/'
  else
    return str

fs.readFile __dirname + '/../package.json', (error, data)->
  throw error if error?
  program
    .version(JSON.parse(data).version)
    .option('-d, --dir [dir]', 'directory of images to copy', './')
    .option('-o, --output [dir]', 'directory you want them to replace', './android/images/')
    .parse(process.argv)

  program.dir = checkDir program.dir
  program.output = checkDir program.output
  inputFileArray = []
  ls = spawn 'ls', [program.dir]
  ls.stdout.on 'data', (d)->
    cpfiles = d.toString().split '\n'
    iterator = (file, cb)->
      if file.indexOf('.png') isnt -1
        fs.readFile program.dir + file, (error, bytes)->
          throw error if error?
          inputFileArray.push
            filename: program.dir + file
            imginfo: imageinfo bytes
          cb()
      else
        cb()
    async.forEach cpfiles, iterator, (error)->
      throw error if error?
      findAndReplace inputFileArray

findAndReplace = (inputFileArray)->
  find = spawn 'find', [program.output]
  find.stdout.on 'data', (d)->
    potential =  d.toString().split '\n'
    iterator = (file,cb)->
      if file.indexOf('.png') isnt -1
        fs.readFile file, (error, bytes)->
          info = imageinfo bytes
          for myfile in inputFileArray
            if info.height is myfile.imginfo.height and info.width is myfile.imginfo.width
              console.log 'cp ' + myfile.filename + ' ' + file
              cp = spawn 'cp', [myfile.filename, file]
              cp.on 'exit', ->
                cb()
              break
    async.forEach potential, iterator, (err)->
      throw err if err?
      console.log 'done'


