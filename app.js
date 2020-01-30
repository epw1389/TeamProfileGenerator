const inquirer = require("inquirer");
const Manager = require("./tests/manager");
const TeamPrompt = require("./tests/team");

var teamPrompt = new TeamPrompt();


inquirer
    //Ask for manager info first
    .prompt(
        [getManager()
        ])
    .then(function (response) {
        console.log(response)
    })