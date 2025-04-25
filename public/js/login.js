//regex for validation, global variables
const regEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const regPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;

//input validation for frmLogin
document.querySelector("#btnLogin").addEventListener("click", function () {
	//taking the value from the HTML input
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

//swapping the login form to registration
document.querySelector("#btnSwapLogin").addEventListener("click", function () {
	window.location.href = 'http://localhost:8080/registration';
});