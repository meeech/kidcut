var cli = require('cli').enable('status');
var fs = require('fs');
var path = require('path');
var cut = require('./lib/cut.js');
var cut_list_menu = require('./lib/cut_menu.js');

var options = {
  input: ['i', 'Path to the input file', 'file'],
  output_dir: ['o', 'Path to the output directory. Will default to same directory as input', 'dir'],
  cut: ['c', 'Path to your cut file', 'file']
};

var commands = ['create'];

cli.parse(options, commands);

cli.main(function(args, options){

  var input, output, cut_file, filename;

  if(options.input) {
    input = path.resolve(options.input);
    filename = path.basename(input, path.extname(input));
    cli.debug('filename: ' + filename + ' input: ' + input);
  } else {
    cli.fatal('No input file provided.');
  }

  if(options.output) {
    output = path.resolve(options.output);
  } else {
    output = path.dirname(input);
  }
  output = path.normalize(output.concat(path.sep));
  cli.debug('output: ' + output);

  if(options.cut) {

    cut_file = path.resolve(options.cut);
    try {
      fs.accessSync(cut_file);
    } catch(e) {
      cli.fatal('Cut file not found:' + cut_file);
    }

    cut.start(input, output, cut_file);

  } else {

    var cut_promise = cut_list_menu(cut_file);

    cut_promise.then(function(data){
      //find cut file
      console.log('then', data);
    });

    cut_promise.catch(function(data) {
      console.error('choice', data);
      cli.fatal('There was a problem with your choice.');
    });
  }

  //

});