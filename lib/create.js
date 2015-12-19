/**
 * Parse options, create the kidcut
 */
var cli = require('cli').enable('status');
var path = require('path');
var exists = require('is-there');

var cut = require('./cut.js');
var cut_list = require('./cut_menu.js');

var CUTS_DIR = path.join(__dirname, '..', 'cuts');


function getInputFile(input_option) {
  if(!input_option) {
    return false;
  }
  return path.resolve(input_option);
}

function getOutputDirectory(output_dir_option, input) {
  //Set up the output dir
  //If none is provided, it will default to the same dir as the input
  var output;
  if(output_dir_option) {
    output = path.resolve(output_dir_option);
  } else {
    output = path.dirname(input);
  }
  return path.normalize(output.concat(path.sep));
}

/**
 * Figure out what cutfile to use
 * @param  {object} args
 * @param  {object} options
 * @return {Promise} fullfilled promise gives path to cut file
 */
function getCutFile(args, options) {
  var cut_file;
  var cut_promise;

  if(options.cut) {
    //passed in as an option - usually when using a custom cut file
    cut_file = path.resolve(options.cut);
  } else if(args[0]) {
    //passed in name of an already existing cut file
    cut_file = path.join(CUTS_DIR, args[0]);
  }

  if(cut_file) {
    cut_promise = new Promise(function(fulfill){
      fulfill(cut_file);
    });
  }

  //Still nothing? trigger list
  if(!cut_file){
    cut_promise = cut_list.prompt();
  }
  return cut_promise;
}

module.exports = function(args, options){
  var input,
    output,
    cut_promise,
    no_clean = options.noclean;

  input = getInputFile(options.input);
  if(!input) {
    cli.fatal('No input file provided.');
  }

  output = getOutputDirectory(options.output, input);

  cut_promise = getCutFile(args, options);

  cut_promise.then(function(cut_file){
    var opts = {
      input: input,
      output_directory: output,
      cut_file: cut_file,
      clean: !no_clean
    };
    check_and_start(opts);
  });

  cut_promise.catch(function(data) {
    console.error('choice', data);
    cli.fatal('There was a problem with your choice.');
  });

};

function check_and_start(opts) {
  var cut_file = opts.cut_file;
  cli.info('Check if' + cut_file + ' exists;');

  if(!exists(cut_file)) {
    cli.fatal('Cut file not found:' + cut_file);
  }

  cut.start(opts);
}