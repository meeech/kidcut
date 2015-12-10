var cli = require('cli');
var fs = require('fs');
var os = require('os');
var path = require('path');
var cut = require('./lib/cut.js');

var options = {
  input: ['i', 'Path to the input file', 'file'],
  output_dir: ['o', 'Path to the output directory. Will default to same directory as input', 'dir'],
  cut: ['c', 'Path to your cut file', 'file']
};

var commands = ['create'];

cli.parse(options, commands);

cli.main(function(args, options){
  console.log('cli main', args, options, this.command);

  var input, output, cut_file, filename;

  if(options.input) {
    input = path.resolve(options.input);
    filename = path.basename(input, path.extname(input));
    console.log('input', filename, input);
  } else {
    cli.fatal('No input file provided.');
  }

  if(options.output) {
    output = path.resolve(options.output);
  } else {
    output = path.dirname(input);
  }
  output = path.normalize(output.concat(path.sep));
  console.log('output',output);

  if(options.cut) {
    cut_file = path.resolve(options.cut);
    try {
      fs.accessSync(cut_file);
    } catch(e) {
      cli.fatal('Cut file not found:' + cut_file);
    }
  } else {
    cli.fatal('No cut selected');
    //show list?
    //make sure file exists
  }

  cut.start(input, output, cut_file);

});