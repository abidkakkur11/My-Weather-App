const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const humidityElement = document.querySelector(".humidity p");
const notificationElement = document.querySelector(".notification");
//const pressureElement = document.querySelector(".pressure p");
const dateElement = document.querySelector(".date h3");

var current=new Date();
/*console.log(current);
const year=current.getFullYear();
var month=current.getMonth();
month=month+1;
const date=current.getDate();
//var completeDate= date + "/"+ month +"/"+ year;*/
var completeDate=current.toLocaleString('en-GB', { timeZone: 'Asia/Kolkata'});
//console.log(completeDate);
dateElement.innerHTML=completeDate;


const weather = {};

weather.temperature = {
    unit : "celsius"
}

const KELVIN = 273;
const key = "c3426018e98dc7587cf82c683becffcb";
//console.log(key);

if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}


function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    
    getWeather(latitude, longitude);
}


function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}


function getWeather(latitude, longitude){
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    
    fetch(api)
        .then(function(response){
            let data = response.json();
            console.log(data);
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            //console.log(data.weather[0]); 
            weather.city = data.name;
            weather.country = data.sys.country;
            weather.humidity = data.main.humidity;
            //weather.pressure = data.main.pressure;
            //console.log(weather.city);
        })
        .then(function(){
            displayWeather();
        });
}

function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    humidityElement.innerHTML = `Humidity:${weather.humidity}`;
    //pressureElement.innerHTML = `Pressure:${weather.pressure}`;
}


function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
} 


tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;
    
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});

