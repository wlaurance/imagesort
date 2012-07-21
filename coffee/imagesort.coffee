fs = require 'fs'
imageinfo = require 'imageinfo'
program = require 'commander'
colors = require 'colors'
async = require 'async'

checkDir = (str)->
  if str[str.length - 1] isnt '/'
    return str += '/'
  else
    return str

fs.readFile __dirname + '/../package.json', (error, data)->
  throw error if error?
  program
    .version(JSON.parse(data).version)
    .option('-i, --filesjson [file]', 'files.json', './files.json')
    .option('-d, --dir [dir]', 'directory of images to check', './')
    .parse(process.argv)

  program.dir = checkDir program.dir
  fs.readFile program.filesjson, (e, d)->
    throw e if e?
    try
      files = (JSON.parse d).files
      errors = 0
      iterator = (file, cb) ->
        uri = program.dir + file.name
        fs.readFile uri, (fe, fdata)->
          console.log ("Missing " + file.name).bold.red if fe?
          errors++ if fe?
          cb() if fe?
          if not fe?
            info = imageinfo fdata
            msg = file.name + '\t'
            if info.width is file.width
              msg += ' Width:' + info.width + ' ✔'.green
            else
              msg += ' Width:' + file.width + " != " + info.width + ' ✗'.red
              errors++
            msg += '\n\t\t'
            if info.height is file.height
              msg += ' Height:' + info.height + ' ✔'.green
            else
              msg += ' Height:' + file.height + " != " + info.height + ' ✗'.red
              errors++
            console.log msg
            cb()

      async.forEach files, iterator, (error)->
        throw error if error?
        if errors is 0
          console.log ('All of your images have the required width and height specified in ' + program.filesjson).green
        else
          console.log ('You fail. You have ' + errors + " error(s). Please fix them and try again").red
    catch e
      throw e
      process.exit()


