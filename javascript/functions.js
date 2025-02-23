// Global Variables
let strHTML = ""
// End Global Variables

//we need the latitude, longitude, and timezone to append to the URL
async function gatherData() {
    //initializing variables for function scope
    let floLatitude = 0.0
    let floLongitude = 0.0
    let strTimezone = "" 

    if (navigator.geolocation) { //IF ALLOWED, will gather accurate location
        navigator.geolocation.getCurrentPosition(async function(position) {
            floLatitude = position.coords.latitude
            floLongitude = position.coords.longitude

            //this is for timezone capture via TimezoneDB
            const objResponse = await fetch(`http://api.timezonedb.com/v2.1/get-time-zone?key=GSWUCIUB70IF&format=json&by=position&lat=${floLatitude}&lng=${floLongitude}`)

            if (!objResponse.ok) {
                throw new Error(`HTTP Error Status: ${objResponse.status}`)
            } else { //if no errors, gather data
                const objData = await objResponse.json()
                strTimezone = encodeURIComponent(objData.zoneName) //changes "America\/Chicago to America%2FChicago"
            }

            //if the function isn't called within the if else conditional we will accidentally create a race condition
            getWeatherData(floLatitude, floLongitude, strTimezone)
        },

        async function error(err) { //IF DENIED, we will gather less accurate location via IP.
            console.warn(`ERROR(${err.code}): ${err.message}, switching to location by IP`)
            Swal.fire({ //notifying the user of location via IP
                title: "Location sharing denied",
                text: "Defaulting to broad location via IP address",
                icon: "error"
            });

            //using https://ipapi.co api for ip geolocation service
            const objResponse = await fetch("https://ipapi.co/json/")

            if (!objResponse.ok) {
                throw new Error(`HTTP Error Status: ${objResponse.status}`)
            } else { //if no errors, gather data
                const objData = await objResponse.json()
                floLatitude = objData.latitude
                floLongitude = objData.longitude
                strTimezone = encodeURIComponent(objData.timezone) //changes "America/Chicago to America%2FChicago"
            }

            //if the function isn't called within the if else conditional we will accidentally create a race condition
            getWeatherData(floLatitude, floLongitude, strTimezone)
            })

    } else { //will play if the browser does not support geolocation
        console.log("Broswer does not support geolocation")
        Swal.fire({
            title: "Oh no! There seems to have been an error.",
            text: "Sorry, but your browser does not seem to support geolocation sharing!",
            icon: "error"
        });
    }
}

// will gather all necessary weather data for website. called in gatherData()
async function getWeatherData(floLatitude, floLongitude, strTimezone) {
    const strWeatherAPIURL = `https://api.open-meteo.com/v1/forecast?latitude=${floLatitude}&longitude=${floLongitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code&timezone=${strTimezone}&forecast_days=1`

    try {
        const objResponse = await fetch(strWeatherAPIURL)

        if (!objResponse.ok) {
            throw new Error(`HTTP Error Status: ${objResponse.status}`)
        }

        //gathering data
        const objData = await objResponse.json() 
        const current = objData.current

        //for time column in divCurrent
        const time = current.time.slice(11,17);
        strHTML += `<h4>${time}</h4>`
        document.querySelector("#divCurrentTime").innerHTML = strHTML

        //for temp column in divCurrent
        strHTML = "" //resetting variable
        const temp = current.temperature_2m
        strHTML += `<h4>${temp}°F</h4>`
        document.querySelector("#divCurrentTemp").innerHTML = strHTML

        //for precipitation column in divCurrent
        strHTML = "" //resetting variable
        const precip = current.precipitation
        strHTML += `<h4>${precip}</h4>`
        document.querySelector("#divCurrentPrecip").innerHTML = strHTML

        //for weather code column in divCurrent
        strHTML = "" //resetting variable
        const wmoCode = current.weather_code
        weatherCode(wmoCode)
        document.querySelector("#divCurrentCode").innerHTML = strHTML

    } catch (objError) { // if open-meteo is currently unavailable
        console.log('Error fetching objData', objError)
        Swal.fire({
            title: "Oh no! There seems to have been an error.",
            text: "Open-Meteo data is currently unavailable right now. Please try again later!",
            icon: "error"
        });
    } 
}

function weatherCode(wmoCode) { 
    //the only reason this was so long was because every HTML output is different here. writing this was awful
    switch (wmoCode) {
        case 0: //clear sky
            strHTML = "<i class='bi bi-sun-fill' style='font-size: 2rem; color: yellow;'></i><br>"
            strHTML += "<p text-center>clear skies</p>"
            break
        case 1: //mainly clear
            strHTML = "<i class='bi bi-cloud-sun' style='font-size: 2rem; color: yellow;'></i><br>"
            strHTML += "<p text-center>mainly clear</p>"
            break
        case 2: //partly cloudy
            strHTML = "<i class='bi bi-cloud-sun-fill' style='font-size: 2rem; color: gray;'></i><br>"
            strHTML += "<p text-center>partly cloudy</p>"
            break
        case 3: //overcast
            strHTML = "<i class='bi bi-cloud-sun-fill' style='font-size: 2rem; color: gray;'></i><br>"
            strHTML += "<p text-center>overcast</p>"
            break
        case 45: //fog
            strHTML = "<i class='bi bi-cloud-fog-fill' style='font-size: 2rem; color: lightgray;'></i><br>"
            strHTML += "<p text-center>fog</p>"
            break
        case 48: //depositing rime fog
            strHTML = "<i class='bi bi-cloud-fog-fill' style='font-size: 2rem; color: lightgray;'></i><br>"
            strHTML += "<p text-center>rime fog</p>"
            break
        case 51: //light drizzle
            strHTML = "<i class='bi bi-cloud-drizzle' style='font-size: 2rem; color: lightskyblue;'></i><br>"
            strHTML += "<p text-center>light drizzle</p>"
            break
        case 53: //moderate drizzle
            strHTML = "<i class='bi bi-cloud-drizzle' style='font-size: 2rem; color: lightskyblue;'></i><br>"
            strHTML += "<p text-center>moderate drizzle</p>"
            break
        case 55: //heavy drizzle
            strHTML = "<i class='bi bi-cloud-drizzle' style='font-size: 2rem; color: lightskyblue;'></i><br>"
            strHTML += "<p text-center>heavy drizzle</p>"
            break
        case 56: //light freezing drizzle
            strHTML = "<i class='bi bi-cloud-drizzle-fill' style='font-size: 2rem; color: lightblue;'></i><br>"
            strHTML += "<p text-center>light freezing drizzle</p>"
            break
        case 57: //heavy freezing drizzle
            strHTML = "<i class='bi bi-cloud-drizzle-fill' style='font-size: 2rem; color: lightblue;'></i><br>"
            strHTML += "<p text-center>heavy freezing drizzle</p>"
            break
        case 61: //slight rain
            strHTML = "<i class='bi bi-cloud-rain' style='font-size: 2rem; color: darkblue;'></i><br>"
            strHTML += "<p text-center>slight rain</p>"
            break
        case 63: //moderate rain
            strHTML = "<i class='bi bi-cloud-rain' style='font-size: 2rem; color: darkblue;'></i><br>"
            strHTML += "<p text-center>moderate rain</p>"
            break
        case 65: //heavy rain
            strHTML = "<i class='bi bi-cloud-rain-heavy' style='font-size: 2rem; color: darkblue;'></i><br>"
            strHTML += "<p text-center>heavy rain</p>"
            break
        case 66: //light freezing rain
            strHTML = "<i class='bi bi-cloud-rain-fill' style='font-size: 2rem; color: blue;'></i><br>"
            strHTML += "<p text-center>light freezing rain</p>"
            break
        case 67: //heavy freezing rain //halfway through this and im about to cry
            strHTML = "<i class='bi bi-cloud-rain-heavy-fill' style='font-size: 2rem; color: blue;'></i><br>"
            strHTML += "<p text-center>heavy freezing rain</p>"
            break
        case 71: //slight snow fall //i swear theres a better way to do this
            strHTML = "<i class='bi bi-cloud-snow' style='font-size: 2rem; color: lightskyblue;'></i><br>"
            strHTML += "<p text-center>slight snow fall</p>"
            break
        case 73: //moderare snow fall
            strHTML = "<i class='bi bi-cloud-snow' style='font-size: 2rem; color: lightskyblue;'></i><br>"
            strHTML += "<p text-center>moderate snow fall</p>"
            break
        case 75: //heavy snow fall
            strHTML = "<i class='bi bi-cloud-snow-fill' style='font-size: 2rem; color: lightskyblue;'></i><br>"
            strHTML += "<p text-center>heavy snow fall</p>"
            break
        case 77: //snow grains
            strHTML = "<i class='bi bi-cloud-snow' style='font-size: 2rem; color: lightskyblue;'></i><br>"
            strHTML += "<p text-center>snow grains</p>"
            break
        case 80: //slight rain showers
            strHTML = "<i class='bi bi-cloud-rain' style='font-size: 2rem; color: darkblue;'></i><br>"
            strHTML += "<p text-center>slight rain showers</p>"
            break
        case 81: //moderate rain showers
            strHTML = "<i class='bi bi-cloud-rain' style='font-size: 2rem; color: darkblue;'></i><br>"
            strHTML += "<p text-center>moderate rain showers</p>"
            break
        case 82: //violent rain showers //not sure if im gonna make it
            strHTML = "<i class='bi bi-cloud-rain-heavy-fill' style='font-size: 2rem; color: blue;'></i><br>"
            strHTML += "<p text-center>violent rain showers</p>"
            break
        case 85: //slight snow showers
            strHTML = "<i class='bi bi-cloud-snow' style='font-size: 2rem; color: lightskyblue;'></i><br>"
            strHTML += "<p text-center>slight snow showers</p>"
            break
        case 86: //heavy snow showers
            strHTML = "<i class='bi bi-cloud-snow-fill' style='font-size: 2rem; color: lightskyblue;'></i><br>"
            strHTML += "<p text-center>heavy snow showers</p>"
            break
        case 95: //slight or moderate thunderstorm
            strHTML = "<i class='bi bi-cloud-lightning-rain-fill' style='font-size: 2rem; color: darkblue;'></i><br>"
            strHTML += "<p text-center>storms</p>"
            break
    } //this is the worst day of my life
}

document.querySelector('#btnSettings').addEventListener('click', function() {
    document.querySelector('#frmWeather').style.display = 'none'
    document.querySelector('#frmWeatherSettings').style.display = 'block'
})

document.querySelector('#btnWeather').addEventListener('click', function() {
    document.querySelector('#frmWeatherSettings').style.display = 'none'
    document.querySelector('#frmWeather').style.display = 'block'
})

//for user temp settings stored in local storage
function setUserTempSettings() {
    let strTempMeasure = localStorage.getItem("tempMeasure")

    if (strTempMeasure == "fahrenheit") { //if fahrenheit, change to celsius
        strTempMeasure = "celsius"
    } else { //if celsius, change to fahrenheit
        strTempMeasure = "fahrenheit"
    }

    if (strTempMeasure == "fahrenheit" || strTempMeasure == "celsius") {
        Swal.fire ({ //letting the user know their selection is saved
            position: "center",
            icon: "success",
            title: "Your selection has been saved",
            showConfirmButton: false,
            timer: 1500
        })
    } else { //shouldn't happen, but just in case, it is still important feedback
        Swal.fire ({
            position: "center",
            icon: "error",
            title: "Error! Something went wrong.",
            showConfirmButton: false,
            timer: 1500
        })
    }

    localStorage.setItem("tempMeasure", strTempMeasure) //setting new temp measure
}

// for user precip settings stored in local storage
function setUserPrecipSettings() {
    let strPrecipMeasure = localStorage.getItem("precipMeasure")

    if (strPrecipMeasure == "inch") { //if inches, change to millimeters
        strPrecipMeasure = "millimeters"
    } else { //if millimeters, change to inches
        strPrecipMeasure = "inch"
    }

    if (strPrecipMeasure == "inch" || strPrecipMeasure == "millimeters") {
        Swal.fire ({ //letting the user know their selection is saved
            position: "center",
            icon: "success",
            title: "Your selection has been saved",
            showConfirmButton: false,
            timer: 1500
        })
    } else { //shouldn't happen, but just in case, it is still important feedback
        Swal.fire ({
            position: "center",
            icon: "error",
            title: "Error! Something went wrong.",
            showConfirmButton: false,
            timer: 1500
        })
    }

    localStorage.setItem("precipMeasure", strPrecipMeasure) //setting new precip measure
} 

//will grab user settings. if none, then it will use create default values for local storage
function getUserSettings() {
    let strTempMeasure = localStorage.getItem("tempMeasure")
    if (strTempMeasure === null) { //=== for equal value and equal type
        strTempMeasure = "fahrenheit" //fahrenheit, default value
        localStorage.setItem("tempMeasure", strTempMeasure)
    }

    let strPrecipMeasure = localStorage.getItem("precipMeasure")
    if (strPrecipMeasure === null) {
        strPrecipMeasure = "inch" //inches, default value
        localStorage.setItem("precipMeasure", strPrecipMeasure)
    }
}

//will clear user's local storage of settings
function clearUserSettings() {
    localStorage.clear()

    // I figure a good way to test if there is still local storage is to try and get some
    // that should not exist after clearing local storage. This is more of a user assurance thing
    // because I can not foresee why this would not work.
    if (localStorage.getItem("tempMeasure") === "fahrenheit" || localStorage.getItem("tempMeasure") === "celsius" ||
        localStorage.getItem("precipMeasure") === "inch" || localStorage.getItem("precipMeasure") === "millimeters") {
        Swal.fire ({
            position: "center",
            icon: "error",
            title: "Error! Something went terribly wrong.",
            showConfirmButton: false,
            timer: 1500
        })
    } else {
        Swal.fire ({
            position: "center",
            icon: "success",
            title: "Successfully cleared user settings!",
            showConfirmButton: false,
            timer: 1500
        })
    }
}