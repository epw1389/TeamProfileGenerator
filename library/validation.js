
class Validation {
    isNameValid(name) {
        return this.isValidString(name);
    }
    isIdValid(id) {
        let isValid = false;
        if (isNaN(id)) {
            
        } else {
            if (id > 0) {
                isValid = true;
            }
        }
        return isValid;
    }
    isTitleValid(title) {
        return this.isValidString(title);
    }

    isEmailValid(email) {
        let isValid = false;
        if (this.isValidString(email)) {
        
            var re = /\S+@\S+\.\S+/;
            isValid = re.test(email);
        }
        return isValid;
    }

    isValidString(str) {
        let isValid = false;
        if (str) {
            if ((str !== "")) {
                isValid = true;
            }
        }
        return isValid;
    }
    invalidNameMessage(){
        return this.invalidStringMessage("name");
    }
    invalidTitleMessage(){
        return this.invalidStringMessage("title");
    }
    invalidGitHubMessage(){
        return this.invalidStringMessage("GitHub username");
    }
    invalidSchoolMessage(){
        return this.invalidStringMessage("School");
    }
    invalidStringMessage(varName = "name") {
        return `Invalid '${varName}' parameter. '${varName}' should be a non-empty string.`;
    }
    invalidOfficeNumberMessage(){
        return this.invalidNumberMessage("office number");
    }
    invalidIdMessage() {
        return this.invalidNumberMessage("id");
    }
    invalidNumberMessage(varName) {
        return `Invalid '${varName}' parameter. '${varName}' should be a positive number.`;
    }
    invalidEmailMessage() {
        return "Invalid 'email' parameter. 'email' should be in 'anystring@anystring.anystring' format";
    }

}

module.exports = Validation;