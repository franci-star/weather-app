import {userid} from "./userid.js";

let place = "MILAZZO";
const j_main_left = document.getElementById("main_left");
const j_date = document.getElementById("date");
let j_today_image = document.getElementById("today_image");
const j_weather = document.getElementById("weather");
const j_temperature = document.getElementById("temperature");
let j_location_name = document.getElementById("location_name");
let j_wind_value = document.getElementById("wind_value");
const j_last_left = document.getElementById("last_left");
const j_next_days = document.getElementById("next_days");

const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
let day = new Date();

async function firstplace(place) {
    const apiresponse_firstplace = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${place}&units=metric&${userid}`);
    const firstplace_position = await apiresponse_firstplace.json();
    return firstplace_position.coord;
}

async function details(lat, lon) {
    const apiresponse_details = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&${userid}`);
    const details_place = await apiresponse_details.json();
    return details_place;
}

function getdate() {
    let today_date_day = document.createElement("div");
    today_date_day.classList.add("today_date_day");
    today_date_day.innerHTML = days[day.getDay()];
    let today_date_number = document.createElement("div");
    today_date_number.classList.add("today_date_number");
    today_date_number.innerHTML = day.getDate() + " " + months[day.getMonth()] + " " + day.getFullYear();
    j_date.appendChild(today_date_day);
    j_date.appendChild(today_date_number);
}

getdate();

firstplace(place).then((firstplace_position) => {
    console.log(firstplace_position);
    details(firstplace_position.lat, firstplace_position.lon).then((details_place) => {
        console.log(details_place);
        today(
            details_place.current.weather[0].description,
            details_place.current.temp,
            details_place.current.wind_speed,
            details_place.current.wind_deg,
            details_place.current.humidity,
            details_place.current.visibility,
            details_place.current.pressure
            );
        let array_min = [];
        let array_max = [];
        for (let i = 0; i < details_place.daily.length; i++) {
            array_min.push(details_place.daily[i].temp.min);
            array_max.push(details_place.daily[i].temp.max);
        }
        let array_description = [];
        for (let i = 0; i < details_place.daily.length; i++) {
            array_description.push(details_place.daily[i].weather[0].description)
        }
        createdailycard(array_min, array_max, array_description);
    });
});

function today(
    weather,
    temperature,
    wind,
    arrow,
    humidity,
    visibility,
    pressure
    ) {
    switch (true) {
        case weather.includes("clear"):
            j_today_image.setAttribute("src", "./icone-terzo-esercizio/clear.png");
            break;
        case weather.includes("few"):
            j_today_image.setAttribute("src", "./icone-terzo-esercizio/few.png");
            break;
        case weather.includes("clouds"):
            j_today_image.setAttribute("src", "./icone-terzo-esercizio/clouds.png");
            break;
        case weather.includes("drizzle"):
            j_today_image.setAttribute("src", "./icone-terzo-esercizio/drizzle.png");
            break;
        case weather.includes("sleet" || "snow"):
            j_today_image.setAttribute("src", "./icone-terzo-esercizio/snow.png");
            break;
        case weather.includes("thunderstorm"):
            j_today_image.setAttribute("src", "./icone-terzo-esercizio/thunderstorm.png");
            break;
        case weather.includes("shower"):
            j_today_image.setAttribute("src", "./icone-terzo-esercizio/shower.png");
            break;
        case weather.includes("rain"):
            j_today_image.setAttribute("src", "./icone-terzo-esercizio/rain.png");
            break;
        case weather.includes("mist" || "smoke" || "haze" || "sand" || "fog" || "dust" || "ash" || "squalls" || "tornado"):
            j_today_image.setAttribute("src", "./icone-terzo-esercizio/mist.png");
    }
    let today_weather = document.createElement("div");
    today_weather.classList.add("today_weather");
    today_weather.innerHTML = weather;
    j_weather.appendChild(today_weather);
    let today_temperature = document.createElement("div");
    today_temperature.classList.add("today_temperature");
    today_temperature.innerHTML = Math.round(temperature) + " &#176;C";
    j_temperature.appendChild(today_temperature);
    j_location_name.classList.add("location_name");
    j_location_name.innerHTML = place.toUpperCase();
    j_wind_value.classList.add("details_value");
    j_wind_value.innerHTML = wind + " mph";
    let j_wind_arrow = document.getElementById("wind_arrow");
    j_wind_arrow.style.transform = `rotate(${arrow}deg)`;
    let j_details_wind_name = document.getElementById("details_wind_name");
    switch (true) {
        case (arrow > 0) && (arrow < 90):
            j_details_wind_name.innerHTML = "NORTH-EAST";
            break;
        case (arrow === 90):
            j_details_wind_name.innerHTML = "EAST";
            break
        case (arrow > 90) && (arrow < 180):
            j_details_wind_name.innerHTML = "SOUTH-EAST";
            break;
        case (arrow === 180):
            j_details_wind_name.innerHTML = "SOUTH";
            break;
        case (arrow > 180) && (arrow < 270):
            j_details_wind_name.innerHTML = "SOUTH-WEST";
            break;
        case (arrow === 270):
            j_details_wind_name.innerHTML = "WEST";
            break;
        case (arrow > 270) && (arrow < 360):
            j_details_wind_name.innerHTML = "NORTH-WEST";
            break;
        case (arrow === 360):
            j_details_wind_name.innerHTML = "NORTH";
            break;
    }
    let j_humidity_value = document.getElementById("humidity_value");
    j_humidity_value.innerHTML = humidity + "&#37;";
    let j_in = document.getElementById("in");
    j_in.style.width = `${humidity}%`;
    if (humidity >= 100) {
        j_in.classList.add("full_in");
    }
    let j_visibility_value = document.getElementById("visibility_value");
    j_visibility_value.innerHTML = (visibility/1609).toFixed(2) + " miles";
    let j_pressure_value = document.getElementById("pressure_value");
    j_pressure_value.innerHTML = pressure + " mb";
}

function createdailycard(temp_min, temp_max, weather) {
    for (let i = 1; i < 6; i++) {
        let singleday = document.createElement("div");
        singleday.classList.add("day");
        let singleday_name = document.createElement("div");
        singleday_name.classList.add("day_name");
        switch (day.getDay()+i) {
            case 1:
                singleday_name.innerHTML = "MONDAY";
                break;
            case 2:
                singleday_name.innerHTML = "TUESDAY";
                break;
            case 3:
                singleday_name.innerHTML = "WEDNESDAY";
                break;
            case 4:
                singleday_name.innerHTML = "THURSDAY";
                break;
            case 5:
                singleday_name.innerHTML = "FRIDAY";
                break;
            case 6:
                singleday_name.innerHTML = "SATURDAY";
                break;
            case 7:
                singleday_name.innerHTML = "SUNDAY";
                break;
            case 8:
                singleday_name.innerHTML = "MONDAY";
                break;
            case 9:
                singleday_name.innerHTML = "TUESDAY";
                break;
            case 10:
                singleday_name.innerHTML = "WEDNESDAY";
                break;
            case 11:
                singleday_name.innerHTML = "THURSDAY";
                break;
        }
        let singleday_image = document.createElement("div");
        singleday_image.classList.add("day_image");
        switch (true) {
            case weather[i].includes("clear"):
                singleday_image.innerHTML = `<img src="./icone-terzo-esercizio/clear.png" alt="">`;
                break;
            case weather[i].includes("few"):
                singleday_image.innerHTML = `<img src="./icone-terzo-esercizio/few.png" alt="">`;
                break;
            case weather[i].includes("clouds"):
                singleday_image.innerHTML = `<img src="./icone-terzo-esercizio/clouds.png" alt="">`;
                break;
            case weather[i].includes("drizzle"):
                singleday_image.innerHTML = `<img src="./icone-terzo-esercizio/drizzle.png" alt="">`;
                break;
            case weather[i].includes("sleet" || "snow"):
                singleday_image.innerHTML = `<img src="./icone-terzo-esercizio/snow.png" alt="">`;
                break;
            case weather[i].includes("thunderstorm"):
                singleday_image.innerHTML = `<img src="./icone-terzo-esercizio/thunderstorm.png" alt="">`;
                break;
            case weather[i].includes("shower"):
                singleday_image.innerHTML = `<img src="./icone-terzo-esercizio/shower.png" alt="">`;
                break;
            case weather[i].includes("rain"):
                singleday_image.innerHTML = `<img src="./icone-terzo-esercizio/rain.png" alt="">`;
                break;
            case weather[i].includes("mist" || "smoke" || "haze" || "sand" || "fog" || "dust" || "ash" || "squalls" || "tornado"):
                singleday_image.innerHTML = `<img src="./icone-terzo-esercizio/mist.png" alt="">`;
                break;
        }
        let singleday_temperatures = document.createElement("div");
        singleday_temperatures.classList.add("day_temperatures");
        let min = document.createElement("div");
        min.innerHTML = Math.round(temp_min[i]) + " &#176;C";
        let max = document.createElement("div");
        max.innerHTML = Math.round(temp_max[i]) + " &#176;C";
        singleday_temperatures.appendChild(min);
        singleday_temperatures.appendChild(max);
        singleday.appendChild(singleday_name);
        singleday.appendChild(singleday_image);
        singleday.appendChild(singleday_temperatures);
        j_next_days.appendChild(singleday);
    }
}

function first_search() {
    j_main_left.style.display = "none";
    j_last_left.style.display = "block";
}

function last_search() {
    let j_input_value = document.getElementById("input_value");
    if (j_input_value.value.trim() === "") {
        console.log("INVALID VALUE");
    } else {
        place = j_input_value.value;
        j_last_left.style.display = "none";
        j_main_left.style.display = "block";
        j_date.innerHTML = "";
        j_today_image.innerHTML = "";
        j_weather.innerHTML = "";
        j_temperature.innerHTML = "";
        j_location_name.innerHTML = "";
        j_wind_value.innerHTML = "";
        j_next_days.innerHTML = "";
        getdate();
        firstplace(place).then((firstplace_position) => {
            console.log(firstplace_position);
            details(firstplace_position.lat, firstplace_position.lon).then((details_place) => {
                console.log(details_place);
                today(
                    details_place.current.weather[0].description,
                    details_place.current.temp,
                    details_place.current.wind_speed,
                    details_place.current.wind_deg,
                    details_place.current.humidity,
                    details_place.current.visibility,
                    details_place.current.pressure
                    );
                let array_min = [];
                let array_max = [];
                for (let i = 0; i < details_place.daily.length; i++) {
                    array_min.push(details_place.daily[i].temp.min);
                    array_max.push(details_place.daily[i].temp.max);
                }
                let array_description = [];
                for (let i = 0; i < details_place.daily.length; i++) {
                    array_description.push(details_place.daily[i].weather[0].description)
                }
                createdailycard(array_min, array_max, array_description);
            });
        });
    }
    j_input_value.value = "";
}

window.first_search = first_search;
window.last_search = last_search;