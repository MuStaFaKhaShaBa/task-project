$(document).ready(_ => {

    const INPUTS = Array.from($('input'));

    const InputsField = {
    }

    INPUTS.forEach(input => {
        InputsField[($(input).attr('name'))] = input;
    })

    let addEventListenerToInput = false; // Add Event Listener Flag [Line 97]

    function validateUserName() {
        const Val = $(INPUTS[0]).val();

        if (!(Val.length >= 5 && Val.length < 16)) { // check Length of Value must be b/w 5-15 
            return setInvalidMSG(INPUTS[0], 'Username must consist of 5 to 15 characters.');
        }
        else if (/(^\d|\d$)/.test(Val)) { // Check Start Or End With Character
            return setInvalidMSG(INPUTS[0], `Username mustn't be starts or ends with Number.`);
        }
        else if (/[\W_]/.test(Val)) { //check if Username has Special Chararcter
            return setInvalidMSG(INPUTS[0], `Username mustn't be contain any Special Character.`);
        }
        $(INPUTS[0]).removeClass('is-invalid');
        return true;

    }

    function validateEmail() {
        const Val = $(INPUTS[1]).val().toLowerCase();

        if (Val.length == 0) { // check input length mustn't be empty
            return setInvalidMSG(INPUTS[1], 'Email not allows to be empty.');
        }
        else if (!/^\w+@\w+\.\w+/.test(Val)) { //check if email not match the regex
            return setInvalidMSG(INPUTS[1], `Email not valid, Please Enter Vaild Email. EX: aa@aa.aa`);
        }
        $(INPUTS[1]).removeClass('is-invalid');
        return true;
    }

    function validatePassword() {
        const Val = $(INPUTS[2]).val();

        if (Val.length < 8) { // check Length of Value must be at least 8 chars 
            return setInvalidMSG(INPUTS[2], 'Password must be at least 8 characters.');
        }
        else if (/(^\s|\s$)/.test(Val)) {
            return setInvalidMSG(INPUTS[2], `Password mustn't be Starts or Ends With Space Character `);
        }

        $(INPUTS[2]).removeClass('is-invalid');
        return true;
    }

    function validatePasswordConfirmation() {
        const Val = $(INPUTS[3]).val(),
            passVal = $(INPUTS[2]).val();

        if (passVal.length === 0) {
            return setInvalidMSG(INPUTS[3], 'Password must be at least 8 characters.');
        }
        else if (Val !== passVal) { // check if password confirmation not matches password
            return setInvalidMSG(INPUTS[3], 'Password not matches, please make sure you enter current password.');
        }

        $(INPUTS[3]).removeClass('is-invalid');
        return true;
    }

    function setInvalidMSG(target, msg) {
        $(target).addClass('is-invalid');
        if (typeof msg == 'string') {
            // convert msg variable to arr 
            msg = [msg];
        }

        const Fragment = document.createDocumentFragment();
        msg.map(error => {
            const li = document.createElement('li');
            li.textContent = error;
            Fragment.append(li);
        });

        $(target).next().html(Fragment);
        return false;
    }

    registerForm.addEventListener('submit', async e => {
        e.preventDefault();

        if (!handleFrontEndValidation()) { // if false Terminate Submition Without send to API
            return false;
        }
        const user = {};

        for (let i = 0; i < INPUTS.length; i++) { // Extract User Object From Inputs
            user[($(INPUTS[i]).attr('name'))] = $(INPUTS[i]).val();
        }

        const data = await sendToAPI(user);

        if (!data.errors) { // if there is no errors navigate to Success Page
            window.localStorage.setItem('userEmail', user['email'])
            window.location.assign('success-page.html');
            return false;
        }

        for (const key in data.errors) {
            setInvalidMSG(InputsField[key], data.errors[key])
        }

    });

    function handleFrontEndValidation() {
        // attach Event Listener To Inputs Field
        !addEventListenerToInput && addEventListenerChange();

        let valid = 1;

        validateUserName() || (valid = 0);
        validateEmail() || (valid = 0);
        validatePassword() || (valid = 0);
        validatePasswordConfirmation() || (valid = 0);

        // if returned True That Mean All Inputs are Valid.
        return valid === 1;
    }

    function addEventListenerChange() {
        addEventListenerToInput = true;
        INPUTS[0].addEventListener('input', validateUserName);
        INPUTS[1].addEventListener('input', validateEmail);
        INPUTS[2].addEventListener('input', validatePassword);
        INPUTS[3].addEventListener('input', validatePasswordConfirmation);
    }

    async function sendToAPI(user) {
        const resp = await fetch(`https://goldblv.com/api/hiring/tasks/register`, {
            body: JSON.stringify(user),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'post'
        });

        return await resp.json()
    }

});
