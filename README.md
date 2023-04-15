# Weather-Pro


## Technology Used:
| Technology Used         | Resource URL           |
| ------------- |:-------------:|
| HTML    | [https://developer.mozilla.org/en-US/docs/Web/HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) |
| CSS     | [https://developer.mozilla.org/en-US/docs/Web/CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)      |
| Git | [https://git-scm.com/](https://git-scm.com/)     |
| JavaScript  | [https://getbootstrap.com/docs/5.3/getting-started/introduction/](https://developer.mozilla.org/en-US/docs/Web/JavaScript)      |
| Jquery UI  | [https://jqueryui.com/](https://jqueryui.com/)      |
| OpenWeather Server Side API | [https://openweathermap.org/api/one-call-3](https://openweathermap.org/api/one-call-3)      |



## Description:

[Visit Deployed Site]:

Having access to an accessible weather application is extremely useful for any individual who want to plan their day or week according to a 5 day weather forecast. This web application does exactly that! With this dynamic web application I’ve brought together HTML, CSS, JavaScript, Jquery, OpenWeather’s API weather data to help enhance the user experience when looking up a city and the corresponding weekly weather conditions. With Weather Pro, a user can enter a city name into the search input and the daily weather (Temp, Wind, and Humidity) as well as a 5 day weather forecast for that respective city are displayed in an appealing display. 
A main advantage of this weather application is its usage of a weather API which provides high quality, reliable, and up to date weather data. 




## Table of Contents:
* Installation (HTML, CSS, JavaScript, Jquery, getElementById, Event Listeners, and Objects, Server Side API’s )
* Usage
* Credits
* License


### Installation:

To install this project, a knowledge of HTML, CSS, JavaScript, Web API’s, and Server Side API,  were required. Methods used ranged from functions, document window methods, querySelector, getElementById, Event Listeners, Local Storage, Variables, If/Else Statements, and the OpenWeather.com weather API link and key. The web application is intended for the user to be able to input any city and get current and updated weather forecasts as well as store their previous searches in a designated area underneath the search section. 

```
async function fetchOneCallWeatherData(lat, lon){
    var data =await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=[minutely,alerts]&appid=${apiKey}&units=imperial`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('onecall data is', data);
        renderWeather(data);
        
        // searchHistoryStored(city);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
}
```
Above: (This is an asynchronous JavaScript function named fetchOneCallWeatherData that takes two arguments lat and lon. The async is used to wait until the data is pulled to call the function renderWeather. The purpose of this function is to fetch weather data from the OpenWeatherMap API using the provided latitude and longitude coordinates. The same method is used for the fetchForecast function.)



```
function renderWeather(data) {
  console.log(data)
    // var name = data.current.name;
    var name="";
    var weather = data.current.weather[0].description;
    var wind = data.current.wind_speed;
    var temp = data.current.temp;
    var humidity = data.current.humidity;
    var iconSrc = "https://openweathermap.org/img/wn/";
    var icon = document.createElement("i");
    var weatherIcon = document.createElement("div");
    var currentDate = renderCurrentWeather();
  
    cityInfo.textContent = `${name} (${currentDate})`;
    windInfo.textContent = `Wind: ${wind} MPH`;
    tempInfo.innerHTML = `Temp: ${temp}&#176;F`;
    humidityInfo.textContent = `Humidity: (${humidity})`;
    icon.style.backgroundImage = `url(${iconSrc + weather[0].icon}@2x.png)`;
  
    weatherIcon.appendChild(icon);
    cityInfo.appendChild(weatherIcon);
    
}
```
(Above: This function pulls the data from the object that the data lied in. The second variable wind extracts the wind speed from the current property of the data object. The wind speed is stored in the wind_speed property of the current object, the temperature which is also a property of the data object [in the console] is stored in the temp variable, etc. Text content and appendChild are used to add the current data that is pulled into those slots using string interrpolation.)


```
function renderForecast(data) {
  var lat=data.city.coord.lat;
  var lon=data.city.coord.lon;

  var { list } = data;
  list = list.reduce((acc, res) => {
    var { dt_txt } = res;
    dt_txt = dt_txt.split(" ")[0];
    if (!acc[dt_txt]) {
      acc[dt_txt] = res;
    }
```
(Above:The second line extracts the lat and lon coordinates of the city from the coord property of the city object in the data object. Following we set the list variable equal to the data. I used the callback function to extract the date from the dt_txt property of each element and splits it into an array with two elements: the date and time. It was suggested to me that I utilize the dt_txt method to shorten the code rather than a foor loop iterating through the data.)


```
function createCard(data) {
  var {
    main: { humidity = "", temp = "" },
    wind: { speed: wind = "" },
    weather,
    dt_txt,
  } = data;
  console.log(data)

  var iconCode = weather[0].icon;

  var formattedDate = dt_txt.split(" ")[0].split("-").reverse().join("/");
  var card = document.createElement("div");
  var date = document.createElement("div");
  var weatherIcon = document.createElement("div");
  var icon = document.createElement("i");
  var tempInfo = document.createElement("p");
  var windInfo = document.createElement("p");
  var humidityInfo = document.createElement("p");

  card.classList.add("card", "flex", "flex_col");
  date.classList.add("date");
  weatherIcon.classList.add("weather_icon");
  icon.style.backgroundImage = `url(${iconSrc + iconCode}@2x.png)`;
  date.textContent = formattedDate;
  windInfo.textContent = windInfo.textContent = `Wind : ${wind} MPH`;
  tempInfo.innerHTML = `Temp : ${temp}&#176;F`;
  humidityInfo.textContent = `Humidity : ${humidity}%`;

  weatherIcon.appendChild(icon);
  card.appendChild(date);
  card.appendChild(weatherIcon);
  card.appendChild(tempInfo);
  card.appendChild(windInfo);
  card.appendChild(humidityInfo);
  return card;
}
```
(Above: I created a function which will pull the weather data from the API key, but the 5 day forecast. I used document.createElement to create the div and p elements that will hold the 5 day forecast cards. I used the classList to add multiple CSS classes to the elements I am creating. I also used the textContent property to write the wind, temp, and humidity labels. Finally I used the appendChild method in order to append the elements and classes to the page in their respective areas.)

```
function saveData({ city = "", lat = "", lon = "" }) {
  let data = localStorage.getItem("Data");
  let updateData = {};
  if (data && data.length) {
    updateData = JSON.parse(data);
    updateData[city] = { lat, lon };
  } else {
    updateData[city] = { lat, lon };
  }
  localStorage.setItem("Data", JSON.stringify(updateData));
  updateSearchHistory();
}

function updateSearchHistory() {
  let data = localStorage.getItem("Data");
  let cities = Object.keys(JSON.parse(data) || []);
  renderHistory(cities);
}
```
(Above: The first function saveData takes an object as an argument, with optional properties city, lat, and lon. It then retrieves any existing data stored in the browser's localStorage under the key "Data". If there is data in localStorage, it parses it into a JavaScript object updateData. The updateSearchHistory function retrieves the "Data" object from localStorage, and converts it to an array of its keys using Object.keys(). It then calls the renderHistory() function, to update the search history on the page.)


![Screenshot](My Computer/Desktop/screenshot.png)  



### Usage:

Weekly weather displays are important to protecting life, property, and daily planning. Forecasts are pulled from OpenWeather’s API database and provide fast and numerical predictions.  When a user enters a city name, they are able to get the current day as well as a 5 day weather forecast. Weather predictions based on temperature and precipitation are important to agriculture, family and event planning, as well as managing outdoor and indoor businesses. With this web application, once a city is entered, data concerning the Wind, Humidity, and the Temperature are readily available in real time. 


## Credits

* JavaScript Assignment: https://www.w3schools.com/js/js_assignment.asp
* Query Selector: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
* Get Element By Id: https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById
* JavaScript Siblings: https://www.javascripttutorial.net/javascript-dom/javascript-siblings/
* JavaScript Objects: https://www.w3schools.com/js/tryit.asp?filename=tryjs_object_object
* Local Storage: https://www.javatpoint.com/javascript-localstorage&https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
* JavaScript Function Parameters: https://www.w3schools.com/js/js_functi on_parameters.asp
* Local Storage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
* ForEach (Array Prototype): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
* API Keys: https://www.learnhowtoprogram.com/intermediate-javascript/asynchrony-and-apis/api-documentation-and-keys
* Array Reduce Property: https://www.programiz.com/javascript/library/array/reduce
* String Interpolation: https://www.w3docs.com/snippets/javascript/how-to-do-string-interpolation-in-javascript.html
* Dt_txt Resource: https://www.cs.drexel.edu/~nkl43/cs375_summer_2020/homework/ajax_api/


### License:
MIT License

Copyright (c) [2023] [Afi Nkhume-Crecy]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,

