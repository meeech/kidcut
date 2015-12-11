var cli = require('cli').enable('status');
var cut_list = require('./cut_menu.js');

module.exports = function(){
  var list = cut_list.getCutsList();
  cli.info('Available cuts');
  console.log('---');
  list.forEach(function(item){
    console.log(item.name);
  });
  console.log('---');
  cli.info('kidcut -i path/to/input/file.mov create <cut_name>');
};