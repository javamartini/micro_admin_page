//regex for validation, global variables
const regEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const regPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;

//input validation for frmLogin
document.querySelector("#btnLogin").addEventListener("click", async function () {
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
		
		//send the asynchronous POST request to the server
		try {
			const objResponse = await fetch("http://localhost:8080/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(objUserData)
			})
			
			//store the sent json data from response
			const objData = await objResponse.json();
			
			//if the response was redirection, then redirect the user to that page
			if (objResponse.status === 201) {
				await Swal.fire ({
					icon: "success",
					title: objData.status,
					text: objData.message
				})
				
				window.location.href = objData.redirect_url; //redirecting the user
			//else, let the user know there was an error processing the post-request
			} else {
				await Swal.fire ({
					icon: "error",
					title: objData.status,
					text: objData.message
				})
			}
		//if there was a network or server error, let the user know
		} catch (error) {
			console.error("SERVER ERROR:", error);
			Swal.fire({
				icon: "error",
				title: "There was a fatal error..",
				text: "There was an error with the server. Please try again later."
			});
		}
	}
});

//swapping the login form to registration
document.querySelector("#btnSwapLogin").addEventListener("click", function () {
	window.location.href = "http://localhost:8080/registration";
});