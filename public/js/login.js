//input validation for frmLogin
document.querySelector("#btnLogin").addEventListener("click", function () {
	//regex for validation
	const regEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
	const regPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;

	//taking the value from the html input
	const strEmail = document.querySelector("#txtLoginEmail").value.trim().toLowerCase();
	const strPassword = document.querySelector("#txtLoginPassword").value;

	let blnError = false;
	let strMessage = "";

	if (!regEmail.test(strEmail)) {
		//input validation for email
		blnError = true;
		strMessage += "<p style='margin-bottom: 5px'>Email must be in the format of an email (name@email.com).</p>";
	}

	if (!regPassword.test(strPassword)) {
		//input validation for password
		blnError = true;
		strMessage += "<p>Your password must be at least 8 characters, have 1 uppercase letter, 1 lowercase letter, and 1 number.</p>";
	}

	if (blnError) {
		//alerts for user
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
