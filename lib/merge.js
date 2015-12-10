/**
 * Takes in timecodes, generates
 * @return {[type]} [description]
 */
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

}
exports.merge = merge;