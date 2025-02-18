// Will bring up divToday when btnToday is clicked. Other divs will hide.
document.querySelector('#btnToday').addEventListener('click', function() {
    document.querySelector('#divToday').style.display = 'block'
    document.querySelector('#divTomorrow').style.display = 'none'
    document.querySelector('#divSeven').style.display = 'none'
})

// Will bring up divTomorrow when btnTomorrow is clicked. Other divs will hide.
document.querySelector('#btnTomorrow').addEventListener('click', function() {
    document.querySelector('#divToday').style.display = 'none'
    document.querySelector('#divTomorrow').style.display = 'block'
    document.querySelector('#divSeven').style.display = 'none'
})

// Will bring up divSeven when btnSeven is clicked. Other divs will hide.
document.querySelector('#btnSeven').addEventListener('click', function() {
    document.querySelector('#divToday').style.display = 'none'
    document.querySelector('#divTomorrow').style.display = 'none'
    document.querySelector('#divSeven').style.display = 'block'
})

// async function getDaily(){
//     try{
//         const objResponse = await fetch('https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m')
//         if(!objResponse.ok){
//             throw new Error(`HTTP Error Status: ${objResponse.status}`)
//         }
//         const objData = await objResponse.json()
//     } catch (objError) {
//         console.log('Error fetching objData', objError)
//         Swal.fire({
//             title: "Oh no! There seems to have been an error.",
//             text: "Open-Meteo data is currently unavailable right now. Please try again later!",
//             icon: "error"
//         });
//     }
    
// }