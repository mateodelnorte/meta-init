const async = require('async');
const fs = require('fs');
const gitRemoteOriginUrl = require('git-remote-origin-url');
const inquirer = require('inquirer');
const path = require('path');

module.exports = function (cb) {

  var questions = [
    {
      type: 'confirm',
      name: 'ok',
      message: 'meta init detected the presence of a .gitslave file. Would you like to import projects from the existing git slave project?'
    }
  ];

  inquirer.prompt(questions).then(function (answers) {
    
    if ( ! answers.ok) return process.exit(0);

    const gitSlaveContents = fs.readFileSync('./.gitslave').toString().trim();
    const repoPairs = gitSlaveContents.split('\n');

    var result = { };

    async.each(repoPairs, function (pair, cb) {
      const tokens = pair.split(' ');
      const folder = tokens[1].replace(/['"]+/g, '');
      gitRemoteOriginUrl(path.join(process.cwd(), folder)).then(function (url) {
        result[folder] = url;
        cb();
      });
    }, function (err) {
      cb(err, result);
    });

  });

}