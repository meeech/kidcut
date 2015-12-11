var inquirer = require('inquirer');

var question = [{
  choices: getCutsList,
  message: 'Select the cut file',
  name: 'cut',
  type: 'list'
}];

function prompt() {

  var promise = new Promise(function(fulfill, reject){

    inquirer.prompt(question, function(answers){
      if(!answers.cut) {
        fulfill(answers.cut);
      } else {
        reject(answers);
      }
    });
  });

  return promise;

}


function getCutsList() {
  return [
    'starwars-ep1',
    'starwars-ep2',
    'starwars-ep3',
    'starwars-ep4'
  ];
}


module.exports = prompt;