const vscode = require('vscode');

function error(message){
  vscode.window.showErrorMessage(message);
}

function info(message){
  vscode.window.showInformationMessage(message);
}

function debug(message){
  console.log(message);
}

module.exports = {
  error,
  info,
  debug
}