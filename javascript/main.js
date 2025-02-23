getUserSettings()

gatherData()

//for user temp settings
document.querySelector("#btnTempMeasure").addEventListener("click", setUserTempSettings)

//for user precip settings
document.querySelector("#btnPrecipMeasure").addEventListener("click", setUserPrecipSettings)

//if user chose to clear data
document.querySelector("#btnClearData").addEventListener("click", clearUserSettings)