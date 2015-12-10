var kidcut = module.exports = {};

var time = require('./lib/time.js');



/**
* read in the timecodes from file
* Expect HH:MM:SS
* @return {Object[]}
*/
function getTimecodes() {
  return [
    {start: '00:00:20', end: '00:00:30'},
    {start: '00:01:55', end: '00:02:05'},
    // {start: '00:01:00', end: '00:01:30'},
  ];
}
kidcut.getTimecodes = getTimecodes;
