//will create a responsive navbar depending on the screen-size
function responsiveNavbar() {
	let navNavBar = document.getElementById("navbar");
	//if navbar has class nav, add the responsive class
	if (navNavBar.className === "nav") {
		navNavBar.className += " responsive";
		//if navbar does not have class nav, leave it alone
	} else {
		navNavBar.className = "nav";
	}
}

//logging out the user
document.getElementById("linkLogout").addEventListener("click", async function (event) {
	event.preventDefault(); //prevents normal link behavior
	try {
		const objResponse = await fetch("http://localhost:8080/logout", {
			method: "POST"
		});
		
		const objData = await objResponse.json(); //grab the data from the response
		
		if (objResponse.status === 200) {
			//if the response status is 200, redirect them with a parameter
			window.location.href = objData.redirect_url;
		} else {
			//else, let the user know that the logout failed for some odd, strange, and unexplainable reason ;)
			alert("For some reason, the logout has failed.");
		}
	} catch (error) {
		//if there was a network or server error, let the user know
		alert("There was a fatal error with the server when trying to log out out.");
	}
});