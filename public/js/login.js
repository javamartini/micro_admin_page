//regex for validation, global variables
const regEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const regPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
const regLetters = /([^\u0000-\u0040\u005B-\u0060\u007B-\u00BF\u02B0-\u036F\u00D7\u00F7\u2000-\u2BFF])+/g; //only letters

//input validation for frmLogin
document.querySelector("#btnLogin").addEventListener("click", function () {
	//taking the value from the html input
	const strEmail = document.querySelector("#txtLoginEmail").value.trim().toLowerCase();
	const strPassword = document.querySelector("#txtLoginPassword").value;

	let blnError = false;
	let strMessage = "";

	//input validation for email
	if (!regEmail.test(strEmail)) {
		blnError = true;
		strMessage += "<p style='margin-bottom: 5px'>Email must be in the format of an email (name@email.com).</p>";
	}

	//input validation for password
	if (!regPassword.test(strPassword)) {
		blnError = true;
		strMessage += "<p>Your password must be at least 8 characters, have 1 uppercase letter, 1 lowercase letter, and 1 number.</p>";
	}

	//alerts for user
	if (blnError) {
		Swal.fire({
			icon: "error",
			title: "Error!",
			html: strMessage,
		});
	} else {
		Swal.fire({
			icon: "success",
			title: "Success!",
			text: "Everything looks good! You should be redirected shortly.",
		});
	}
});

//input validation for frmRegister
document.querySelector("#btnRegister").addEventListener("click", function () {
	//taking the value from the html input
	const strEmail = document.querySelector("#txtRegisterEmail").value.trim().toLowerCase();
	const strPassword = document.querySelector("#txtRegisterPassword").value;
	const strConfirmPassword = document.querySelector("#txtConfirmPassword").value;
	const strFirstName = document.querySelector("#txtFirstName").value.trim();
	const strLastName = document.querySelector("#txtLastName").value.trim();

	let blnError = false;
	let strMessage = "";

	//input validation for email
	if (!regEmail.test(strEmail)) {
		blnError = true;
		strMessage += "<p style='margin-bottom: 5px'>Email must be in the format of an email (name@email.com).</p>";
	}

	//input validation for password
	if (!regPassword.test(strPassword)) {
		blnError = true;
		strMessage += "<p style='margin-bottom: 5px'>Your password must be at least 8 characters, have 1 uppercase letter, 1 lowercase letter, and 1 number.</p>";
	}

	//input validation for confirming password
	if (strConfirmPassword !== strPassword) {
		blnError = true;
		strMessage += "<p style='margin-bottom: 5px'>The fields 'Confirm Password' and 'Password' must match.</p>";
	}

	//input validation for first name
	if (!regLetters.test(strFirstName)) {
		blnError = true;
		strMessage += "<p style='margin-bottom: 5px'>Please enter a valid first name.</p>";
	}

	//input validation for last name
	if (!regLetters.test(strLastName)) {
		blnError = true;
		strMessage += "<p>Please enter a valid last name.</p>";
	}

	//alerts for user
	if (blnError) {
		Swal.fire({
			icon: "error",
			title: "Error!",
			html: strMessage,
		});
	} else {
		Swal.fire({
			icon: "success",
			title: "Success!",
			text: "Everything looks good! You should be redirected shortly.",
		});
	}
});

//swapping login form to registration
document.querySelector("#btnSwapLogin").addEventListener("click", function () {
	document.querySelector("#frmLogin").style.display = "none";
	document.querySelector("#frmRegister").style.display = "block";
});

//swapping registration form to login
document.querySelector("#btnSwapRegister").addEventListener("click", function () {
	document.querySelector("#frmRegister").style.display = "none";
	document.querySelector("#frmLogin").style.display = "block";
});
