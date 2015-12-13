var cli = require('cli').enable('status');
var fs = require('fs');
var path = require('path');
var cut = require('./cut.js');
var cut_list = require('./cut_menu.js');
var exists = require('is-there');
var CUTS_DIR = path.join(__dirname, '..', 'cuts');

module.exports = function(args, options){
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
    check_and_start(input, output, cut_file);

  } else if(args[0]) {

    cut_file = path.join(CUTS_DIR, args[0]);
    check_and_start(input, output, cut_file);

  } else {

    var cut_promise = cut_list.prompt();

    cut_promise.then(function(data){
      //find cut file
      console.log('then', data);
      cut_file = data;
      check_and_start(input, output, cut_file);
    });

    cut_promise.catch(function(data) {
      console.error('choice', data);
      cli.fatal('There was a problem with your choice.');
    });
  }
};

function check_and_start(input, output, cut_file) {
  cli.info('Checking if' + cut_file + ' exists;');
  if(!exists(cut_file)) {
    cli.fatal('Cut file not found:' + cut_file);
  }

  cut.start(input, output, cut_file);
}