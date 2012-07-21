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
    .option('-d, --dir [dir]', 'directory of images to copy', './')
    .parse(process.argv)

  program.dir = checkDir program.dir

