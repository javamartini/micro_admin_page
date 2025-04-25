//regex for validation, global variables
const regEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const regPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
const regLetters = /([^\u0000-\u0040\u005B-\u0060\u007B-\u00BF\u02B0-\u036F\u00D7\u00F7\u2000-\u2BFF])+/g; //only letters

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
	
	//input validation for the first name
	if (!regLetters.test(strFirstName)) {
		blnError = true;
		strMessage += "<p style='margin-bottom: 5px'>Please enter a valid first name.</p>";
	}
	
	//input validation for the last name
	if (!regLetters.test(strLastName)) {
		blnError = true;
		strMessage += "<p>Please enter a valid last name.</p>";
	}
	
	//alerts for user
	if (blnError) {
		Swal.fire({
			icon: "error",
			title: "Error!",
			html: strMessage
		});
	} else {
		//prepare a JSON to send the user data towards
		const objUserData = {
			email: strEmail,
			password: strPassword,
			first_name: strFirstName,
			last_name: strLastName
		};
		
		//send the POST request to the server
		fetch("http://localhost:8080/registration", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(objUserData)
		}).then(response => response.json())
			.then(data => {
				//if the data sent, let the user know and redirect the ussr
				if (data.boolean === true) {
					Swal.fire({
						icon: "success",
						title: data.status,
						text: data.message
					}).then(() => {
						window.location.href = "http://localhost:8080/login";
					});
				} else {
					//Something went wrong, but the server responded. The user could already have been created.
					Swal.fire({
						icon: "error",
						title: data.status,
						text: data.message
					});
				}
			}).catch(error => {
			//network or critical error
			console.error("Server error:", error);
			Swal.fire({
				icon: "error",
				title: "There was a fatal error..",
				text: "There was an error with the server. Please try again later."
			});
		});
	}
});

//swapping the registration form to the login form
document.querySelector("#btnSwapRegister").addEventListener("click", function () {
	window.location.href = "http://localhost:8080/login";
});
