/**
 * Time helpers
 */
var SECONDS_PER_MINUTE = 60;
var SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE;

/**
 * @param  {string} time hh:mm:ss
 * @return {int} seconds
 */
function seconds(time) {
  var t = time.split(':').map(function(val){ return parseInt(val, 10); });
  var seconds = (t[0] * SECONDS_PER_HOUR) + (t[1] * SECONDS_PER_MINUTE) + t[2];
  return seconds;
}

/**
 * Given a start and end timecode, will calculate the duration
 * This is because we want to allow defining start - end timecode,
 * which is easier, but we need duration for the cutting process
 *
 * @param  {[type]} start [description]
 * @param  {[type]} end   [description]
 * @return {[type]}       [description]
 */
function calculateDuration(start, end) {
  return seconds(end) - seconds(start);
}
exports.calculateDuration = calculateDuration;