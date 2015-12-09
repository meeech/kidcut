var _ = require('lodash');
var ffmpeg = require('fluent-ffmpeg');

var kidcut = require('./kidcut');
//
var filename = '/Users/mitch/src/kidcut/tmp/StarWars_A_New_Hope.mov';
var output_dir = '/Users/mitch/src/kidcut/tmp/';
var timecodes = kidcut.getTimecodes();

var index = 0;

function generateClip(time, index){

  var duration = kidcut.calculateDuration(time.start, time.end);
  console.log('Generating clip start:', time.start, 'end:', time.end, 'dur:', duration);

  var video = ffmpeg(filename);

  video.on('progress', function(progress) {
    console.log('Processing: ' + Math.round(progress.percent * 100) + '% done');
  });

  video.on('error', function(err) {
    console.log('An error occurred: ', err.message);
  });

  video.on('end', function() {
    console.log('Done');
    var next = timecodes.shift();
    if(next) {
      index = index + 1;
      generateClip(next, index);
    }
  });

  video.seekInput(time.start);
  video.duration(duration);
  video.output(output_dir + 'clip_' + index +'.mp4');
  video.run();

}

var startcode = timecodes.shift();
generateClip(startcode, index);
