// Global Variables
// const baseURL = 'https://api.open-meteo.com/v1/forecast?'
let linkLatitude = ""
let linkLongitude = ""
let strHTML = ""

getCurrent()

//we need the latitude and longitude to append to the URL
function getLocation()
{
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition)
      
    } else {
        console.log("Geolocation is not supported by this browser.")
        strMessage += "Geolocation is not supported by this browser."
    }
}

function showPosition(position)
{
    linkLatitude = 'latitude=' + position.coords.latitude + '&'
    linkLongitude = 'longitude=' + position.coords.longitude + '&'
    // document.querySelector('#divToday').innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
    console.log("Latitude: " + position.coords.latitude)
} 

//hourly 24-hour forecast, for divToday
async function getCurrent()
{
    try
    {
        const objResponse = await fetch('https://api.open-meteo.com/v1/forecast?latitude=35.9606&longitude=-85.8141&current=temperature_2m,precipitation,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FChicago&forecast_days=1') //response, not data
        if(!objResponse.ok)
        {
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
    }
    catch (objError)
    {
        console.log('Error fetching objData', objError)
        Swal.fire({
            title: "Oh no! There seems to have been an error.",
            text: "Open-Meteo data is currently unavailable right now. Please try again later!",
            icon: "error"
        });
    }
}

function weatherCode(wmoCode)
{ //the only reason this was so long was because every HTML output is different here. writing this was awful
    switch (wmoCode)
    {
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

// //hourly 24-hour forecast, for divToday
// fetch('https://api.open-meteo.com/v1/forecast?latitude=35.9606&longitude=-85.8141&hourly=temperature_2m&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FChicago&forecast_days=1') //fetch promise
// .then(objResponse => objResponse.json()) //convert the response to JSON
// .then(objData => {
//     let strHTML = '<ul>'
//     objData.hourly.temperature_2m.forEach(function(temp, hour){
//         strHTML += `<li>Hour ${hour}: ${temp}°F</li>`
//     })
//     strHTML += '</ul>'
//     document.querySelector('#divToday').innerHTML = strHTML
// })
// .catch(objError => { //This little trick, .catch, was something cool I found. It's description denotes it is used specifically for this purpose.
//     console.log('Error fetching objData', objError)
//     strMessage += "<p>Open-Meteo data is currently unavailable right now. Please try again later!</p>"
//     Swal.fire({
//         title: "Oh no! There seems to have been an error.",
//         html: strMessage,
//         icon: "error"
//     });
// })