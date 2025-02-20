// Global Variables
const baseURL = 'https://api.open-meteo.com/v1/forecast?'
let linkLatitude = ""
let linkLongitude = ""
let strMessage = ""

//we need the latitude and longitude to append to the URL
function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition)
      
    } else {
        console.log("Geolocation is not supported by this browser.")
        strMessage += "Geolocation is not supported by this browser."
    }
}

function showPosition(position) {
    linkLatitude = 'latitude=' + position.coords.latitude + '&'
    linkLongitude = 'longitude=' + position.coords.longitude + '&'
    // document.querySelector('#divToday').innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
    console.log("Latitude: " + position.coords.latitude)
} 

//hourly 24-hour forecast, for divToday
async function getHourly(){
    try{
        const objResponse = await fetch('https://api.open-meteo.com/v1/forecast?latitude=35.9606&longitude=-85.8141&hourly=temperature_2m,precipitation_probability,precipitation&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FChicago&forecast_days=1') //response, not data
        if(!objResponse.ok){
            throw new Error(`HTTP Error Status: ${objResponse.status}`) //tick marks allow us to use variables
        }
        const objData = await objResponse.json()

        //for hour column in divToday
        let timeHTML = '<ul>'
        objData.hourly.time.forEach(function(time){
            time = time.slice(11,17) //Want to cut extraneous information
            timeHTML += `<p>${time}</p>`
        })
        timeHTML += "</ul>"
        document.querySelector("#divTodayHourly").innerHTML += timeHTML

        //for temp column in divToday
        let tempHTML = '<ul>'
        objData.hourly.temperature_2m.forEach(function(temp){
            tempHTML += `<p>${temp}°F</p>`
        })
        tempHTML += "</ul>"
        document.querySelector("#divTodayTemp").innerHTML += tempHTML
    }
    catch (objError){
        console.log('Error fetching objData', objError)
        Swal.fire({
            title: "Oh no! There seems to have been an error.",
            text: "Open-Meteo data is currently unavailable right now. Please try again later!",
            icon: "error"
        });
    }
}

getHourly()

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