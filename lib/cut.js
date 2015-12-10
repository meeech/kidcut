var cli = require('cli');
var calculateDuration = require('./time.js').calculateDuration;
var EventEmitter = require('events');
var emitter = new EventEmitter();
var ffmpeg = require('fluent-ffmpeg');

var MERGE_EVENT = 'merge';

var cut = module.exports = {};
cut.start = function(input, output_dir, cut_file) {
  console.log('-------> START', input, output_dir, cut_file);
  var details = require(cut_file);
  var film_info = details.data.title;
  var time_codes = details.times;

  cli.info('Beginning to cut ' + film_info);
  generateClip(input, output_dir, time_codes.slice(0));
  console.log(emitter);
  emitter.addListener(MERGE_EVENT, function() {
    cli.info('Beginning merge process...');
    merge(output_dir, time_codes);
  });

};

/**
 * [generateClip description]
 * @param  {[type]} time [description]
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

  output_file_name = output_dir.concat(_generate_clip_name(time));
  cli.info('Output file name:' + output_file_name);

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


function merge(time_codes) {

  var video;
  var i;
  var input_file;
  for (i = 0; i <= index; i++) {
    input_file = output_dir + 'clip_' + i + '.mp4';
    if(!video) {
      video = ffmpeg(input_file);
    } else {
      video.input(input_file);
    }
  }

  video.on('progress', function(progress) {
    console.log('Processing: ' + Math.round(progress.percent * 100) + '% done');
  });

  video.on('end', function() {
    console.log('files have been merged succesfully');
  });

  video.on('error', function(err) {
    console.log('an error happened: ', err.message);
  });

  video.mergeToFile(output_dir + 'superclip.mp4');



function _generate_clip_name(time) {
  return time.start.concat('_',time.end,'.mp4');
}

function _error(err) {
  cli.fatal('An error occurred:' + err.message);
}

function _progress(progress) {
  cli.info('Processing: ' + Math.round(progress.percent * 100) + '% done');
}