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
			html: strMessage
		});
	} else {
		//prepare a JSON to send the user data
		const objUserData = {
			email: strEmail,
			password: strPassword
		};
		
		//send the POST request to the server
		fetch("http://localhost:8080/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(objUserData)
		}).then(response => response.json()).then(data => {
			//if the data was fine, then let the user know and redirect the user
			if (data.boolean === true) {
				localStorage.setItem("jwt_token", data.jwt_token); //storing user session token into local storage
				Swal.fire({
					icon: "success",
					title: data.status,
					text: data.message
					//redirect the user with the appropriate header
				}).then(() => {
					fetch("http://localhost:8080/status", {
						method: "GET",
						headers: {
							"Authorization": `Bearer ${data.jwt_token}`
						}
					}).then(response => {
						//if the response is okay, send them to the page
						if (response.ok) {
							window.location.replace("http://localhost:8080/status");
							//else, throw a new error
						} else {
							throw new Error("AUTHORIZATION FAILED");
						}
					}).catch(error => {
						console.error("ERROR:", error);
						
					});
				});
				//else, let the user know that they are unauthorized
			} else {
				Swal.fire({
					icon: "error",
					title: data.status,
					text: data.message
				});
			}
			//if something is wrong with the server, let the user know
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

//swapping the login form to registration
document.querySelector("#btnSwapLogin").addEventListener("click", function () {
	window.location.href = "http://localhost:8080/registration";
});