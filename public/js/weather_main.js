getUserSettings();

gatherData();

//for user temp settings
document.querySelector("#btnTempMeasure").addEventListener("click", function () {
	setUserTempSettings();
	gatherData(); //reloads data with user's selection
});

//for user precip settings
document.querySelector("#btnPrecipMeasure").addEventListener("click", function () {
	setUserPrecipSettings();
	gatherData(); //reloads data with user's selection
});

if ("serviceWorker" in navigator) {
	navigator.serviceWorker
		.register("/service_worker.js")
		.then(() => console.log("Service Worker Registered"))
		.catch((error) => console.log("Service Worker Registration Failed", error));
}
