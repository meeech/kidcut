var _ = require('lodash');
var cli = require('cli').enable('status');
var calculateDuration = require('./time.js').calculateDuration;
var EventEmitter = require('events');
var emitter = new EventEmitter();
var ffmpeg = require('fluent-ffmpeg');
var fs = require('fs');
var exists = require('is-there');

var MERGE_EVENT = 'merge';
var CLEANUP_EVENT = 'clean';
var cut = module.exports = {};

//Set this up in start - it will be a curried function
cut.generate_tmp_clip_path = function(){ console.log('this should be overridden with a curried func'); };


/**
 *
 * @param  {object} opts
 *         @param {string} opts.input
 *         @param {string} opts.output_directory
 *         @param {string} opts.cut_file
 *         @param {bool} opts.clean
 */
cut.start = function(opts) {

  var input = opts.input;
  var output_directory = opts.output_directory;
  var cut_file = opts.cut_file;
  var clean = opts.clean;

  cli.ok(('> Start: ').concat(input, ' ',output_directory, ' ', cut_file));

  var details = require(cut_file);

  var film_name = details.data.title;
  var time_codes = details.times;

  emitter.addListener(MERGE_EVENT, function() {
    cli.info('Beginning merge process...');
    merge(film_name, output_directory, time_codes);
  });

  emitter.addListener(CLEANUP_EVENT, function() {
    cli.info('Beginning cleanup process...');
    if(clean) {
      cleanup(time_codes);
    }
  });

  //Setup the temp clip file path generator
  cut.generate_tmp_clip_path = _.curry(_generate_clip_path)(film_name, output_directory);

  cli.info('Beginning to cut ' + film_name);

  generateClip(input, output_directory, time_codes.slice(0));

};

function cleanup(time_codes) {
  time_codes.forEach(function(code){
    var file_path = cut.generate_tmp_clip_path(code);
    fs.unlink(file_path, function (err) {
      if (err) {
        console.log('Unable to delete', file_path, err);
      }
    });
  });
}

/**
 * [generateClip description]
 * @param  {String} filename source file
 * @param {String} outputdir
 * @param {String[]} time_codes array of time codes we are generating.
 *                              shifts one off the stack
 * @return {[type]}      [description]
 */
function generateClip(filename, output_dir, time_codes){

  var duration;
  var video;
  var output_file_name;
  var time = time_codes.shift();

  if(!time) {
    cli.info('All time codes processed, making kidcut');
    emitter.emit(MERGE_EVENT);
    return;
  }

  output_file_name = cut.generate_tmp_clip_path(time);
  cli.info('Output file name:' + output_file_name);

  //Allow for resuming
  if(exists(output_file_name)) {
    cli.info('File already exists, skipping');
    generateClip(filename, output_dir, time_codes);
    return;
  }

  duration = calculateDuration(time.start, time.end);
  cli.info('Generating clip start:' + time.start + 'end:' + time.end + 'dur:' + duration);

  video = ffmpeg(filename);
  video.seekInput(time.start);
  video.duration(duration);
  video.output(output_file_name);

  video.on('progress', _progress);
  video.on('error', _error);
  video.on('end', function() {
    generateClip(filename, output_dir, time_codes);
  });

  video.run();

}

/**
 *
 * @param  {String} film_name
 * @param  {String} output_dir
 * @param  {String[]} time_codes]
 * @return {void}
 */
function merge(film_name, output_dir, time_codes) {

  var video;
  var super_cut_output = _generate_super_clip_path(film_name, output_dir);

  var input_files = time_codes.map(function(code){
    return cut.generate_tmp_clip_path(code);
  });

  if(input_files.length === 0) {
    console.log(time_codes);
    cli.fatal('No timecodes');
  }

  video = ffmpeg(input_files.shift());
  input_files.forEach(video.input, video);

  video.on('progress', _progress);
  video.on('error', _error);
  video.on('end', function() {
    cli.ok('Supercut is made! ' + super_cut_output);
    emitter.emit(CLEANUP_EVENT);
  });

  video.mergeToFile(super_cut_output);
}

/**
 * Helpers
 */

//The final file that is output
function _generate_super_clip_path(name, output_dir) {
  return output_dir.concat(name,'.kidcut', '.mp4');
}

function _generate_clip_path(name, output_dir, time) {
  var regex = /\:/g;
  return output_dir.concat(name, '_', time.start, '-', time.end, '.mp4').replace(regex, '_');
}

function _error(err) {
  cli.fatal('An error occurred:' + err.message);
}

function _progress(progress) {
  cli.info('Processing: ' + Math.round(progress.percent * 100) + '% done');
}