var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');

var CUTS_DIR = path.join(__dirname, '..', 'cuts');

var question = [{
  choices: getCutsList,
  message: 'Select the cut file',
  name: 'cut',
  type: 'list'
}];

function prompt() {

  var promise = new Promise(function(fulfill, reject){

    inquirer.prompt(question, function(answers){
      if(answers.cut) {
        fulfill(answers.cut);
      } else {
        reject(answers);
      }
    });
  });

  return promise;

}

function getCutsList() {
  return fs.readdirSync(CUTS_DIR).map(function(file) {
    return {
      name: file,
      value: path.join(CUTS_DIR, file)
    };
  });
}


module.exports = prompt;