#!/usr/bin/env node
var cli = require('cli').enable('status');

var options = {
  input: ['i', 'Path to the input file', 'file'],
  output_dir: ['o', 'Path to the output directory. Will default to same directory as input', 'dir'],
  cut: ['c', 'Path to your cut file', 'file'],
  noclean: ['n', 'Do not clean up temporary clip files. This is useful when working on a clip, since it will speed up your iterations - if we find a previous matching clip, we don\'recreate it' , 'bool']
};

var commands = ['create', 'list'];

cli.parse(options, commands);

cli.main(function(args, options){

  if(cli.command === 'list') {
    require('./lib/list.js')();
    return;

  }

  if(cli.command === 'create') {
    require('./lib/create.js')(args, options);
  }

});