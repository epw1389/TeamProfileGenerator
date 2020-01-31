const Prompts = require("./library/prompts");
const Manager = require("./library/manager");
const Engineer = require("./library/engineer");
const Intern = require("./library/intern");
const inquirer = require('inquirer');
var fs = require("fs");

let prompts = new Prompts();
require('events').EventEmitter.defaultMaxListeners = 25;

let team = [];
function start() {
    console.log("Starting...");
    team = [];
    AskTeamQuestions();
}

function getManagerInfo() {
    console.log("Team Manager Information:");
    return getMemberInfo("Manager");
}

function getMemberInfo(role) {
    let memberPrompts;
    switch (role) {
        case "Manager":
            memberPrompts = prompts.manager;
            break;
        case "engineer":
            memberPrompts = prompts.engineer;
            break;
        case "intern":
            memberPrompts = prompts.intern;
            break;
        default:
    }
    return inquirer.prompt(memberPrompts);
}

async function AskTeamMemberInfo() {
    return inquirer.prompt(prompts.memberType).then(async function (mtAnswer) {
        await getMemberInfo(mtAnswer.memberType).then(mInfoAnswer => {
            switch (mtAnswer.memberType) {
                case "engineer":
                    let eng = new Engineer(mInfoAnswer.name, mInfoAnswer.empId, "Engineer", mInfoAnswer.email, mInfoAnswer.gitHub);
                    team.push(eng);
                    break;
                case "intern":
                    let int = new Intern(mInfoAnswer.name, mInfoAnswer.empId, "Intern", mInfoAnswer.email, mInfoAnswer.school);
                    team.push(int);
                    break;
                default:
            }
        });
    });
}

async function AskTeamQuestions() {
    getManagerInfo().then(managerInfo => {
        let manager = new Manager(managerInfo.name, parseInt(managerInfo.empId), "Manager", managerInfo.email, managerInfo.officeNumber);
        team.push(manager);
        inquirer.prompt([{
            type: "number",
            message: "How many people work for the manager in this project?",
            name: "headCount"
        }]).then(async function (response) {
            for (let i = 0; i < response.headCount; i++) {
                await AskTeamMemberInfo();
            }
            generateHtmlDoc();
        });
    });
}

function getUpdatedTemplateWithCommonFields(member) {
    let role = member.getRole()
    let roleLower = role.toLowerCase();
    let file = "./templates/" + roleLower + ".html";
    let htmlTemplateData = fs.readFileSync(file, member);
    let htmlTemplateText = htmlTemplateData.toString();
    htmlTemplateText = htmlTemplateText.replace("--" + roleLower + "Name--", member.name);
    htmlTemplateText = htmlTemplateText.replace("--role--", role);
    htmlTemplateText = htmlTemplateText.replace("--id--", member.id);
    htmlTemplateText = htmlTemplateText.replace("--email--", member.email);
    return htmlTemplateText;
}

function generateHtmlDoc() {
    let htmlTeamData = fs.readFileSync("./templates/team.html");
    let htmlTeamText = htmlTeamData.toString();
    let members = [];
    team.forEach(member => {
        switch (member.getRole()) {
            case "Manager":
                let htmlManagerText = getUpdatedTemplateWithCommonFields(member);
                htmlManagerText = htmlManagerText.replace("--officeNumber--", member.officeNumber);
                htmlTeamText = htmlTeamText.replace("--Manager--", htmlManagerText);
                break;
            case "Engineer":
                let htmlEngineerText = getUpdatedTemplateWithCommonFields(member);
                htmlEngineerText = htmlEngineerText.replace("--gitHub--", member.github);
                members.push(htmlEngineerText);
                break;
            case "Intern":
                let htmlInternText = getUpdatedTemplateWithCommonFields(member);
                htmlInternText = htmlInternText.replace("--university--", member.school);
                members.push(htmlInternText);
                break;
            default:
                break;

        }
    });

    //Siavash 1/28/2020 Added the following loop to break the array into smaller chunks. In that way I can control number of rows and columns.
    let membersString = "";
    let i, j, chunk = 3;
    for (i = 0, j = members.length; i < j; i += chunk) {
        let temparray = members.slice(i, i + chunk);
        membersString += '<div class="row">'
        let cols = temparray.map(item => {
            return '<div class="col-4">' + item + '</div>';
        });
        membersString += cols.join("");
        membersString += '</div>'
    }
    htmlTeamText = htmlTeamText.replace("--Team--", membersString);
    let fileName = "./output/team.html";
    fs.writeFileSync(fileName, htmlTeamText);
    console.log("HTML file created: " + fileName);
}

console.log("You will be prompted to create an engineering team, which can consist of managers, engineers, and interns. ");
console.log("---");
inquirer
    .prompt([
        {
            type: "confirm",
            message: "Are you ready to start?",
            name: "start"
        }
    ])
    .then(input => {
        if (input.start) {
            start();
        }
    });