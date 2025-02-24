getUserSettings()

gatherData()

//for user temp settings
document.querySelector("#btnTempMeasure").addEventListener("click", function () {
    setUserTempSettings()
    gatherData() //reloads data with user's selection
})

//for user precip settings
document.querySelector("#btnPrecipMeasure").addEventListener("click", function() {
    setUserPrecipSettings()
    gatherData() //reloads data with user's selection
})

//if user chose to clear data
document.querySelector("#btnClearData").addEventListener("click", clearUserSettings)