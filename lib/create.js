/**
 * Parse options, create the kidcut
 */
var cli = require('cli').enable('status');
var path = require('path');
var exists = require('is-there');

var cut = require('./cut.js');
var cut_list = require('./cut_menu.js');

var CUTS_DIR = path.join(__dirname, '..', 'cuts');

module.exports = function(args, options){
  var input, output, cut_file, cut_promise, filename;

  if(options.input) {
    input = path.resolve(options.input);
    filename = path.basename(input, path.extname(input));
    cli.debug('filename: ' + filename + ' input: ' + input);
  } else {
    cli.fatal('No input file provided.');
  }

  //Set up the output dir
  //If none is provided, it will default to the same dir as the input
  if(options.output) {
    output = path.resolve(options.output);
  } else {
    output = path.dirname(input);
  }
  output = path.normalize(output.concat(path.sep));
  cli.debug('output: ' + output);

  //Which cut file to use?
  //1) passed in as an option - eg: when using a custom cut file
  if(options.cut) {

    cut_file = path.resolve(options.cut);
    check_and_start(input, output, cut_file);

  } else if(args[0]) {
    //passed in name of an already existing cut file
    cut_file = path.join(CUTS_DIR, args[0]);
    check_and_start(input, output, cut_file);

  } else {
    //No cut passed in, so show the list
    cut_promise = cut_list.prompt();

    cut_promise.then(function(data){
      //find cut file
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