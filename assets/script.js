var cityInfo = document.querySelector(".city_info");
var windInfo = document.querySelector(".wind");
var tempInfo = document.querySelector(".temp");
var humidityInfo = document.querySelector(".humidity");
var cardWrapper = document.querySelector(".forecast_wrapper");
var searchHistory = document.querySelector(".search_history");
var cityInput = document.querySelector("#city-input");
var searchBtn = document.querySelector("#search_btn");
console.log(searchBtn);

var lat = null;
var lon = null;
var apiKey = "5313640f5787ea9e3c4cda59b1ef2c59";
var WEATHER_API = "weather";
var FORECAST_API = "forecast";

// the async is used to wait until the data is pulled to call the function renderWeather
async function fetchOneCallWeatherData(lat, lon) {
  var data = await fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=[minutely,alerts]&appid=${apiKey}&units=imperial`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("onecall data is", data);
      renderWeather(data);

      // searchHistoryStored(city);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}
async function fetchForecast(lat, lon) {
  var data = await fetch(
    `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("5 call data is", data);
      renderForecast(data);

      // searchHistoryStored(city);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}
function renderWeather(data) {
  console.log(data);
  // var name = data.current.name;
  var name = "";
  var weather = data.current.weather[0].description;
  var wind = data.current.wind_speed;
  var temp = data.current.temp;
  var humidity = data.current.humidity;
  var iconSrc = "https://openweathermap.org/img/wn/";
  var icon = document.createElement("i");
  var weatherIcon = document.createElement("div");
  var currentDate = renderCurrentWeather();

  weatherIcon.classList.add("weather_icon");
  icon.ariaHidden = true;

  cityInfo.textContent = `${name} (${currentDate})`;
  windInfo.textContent = `Wind: ${wind} MPH`;
  tempInfo.innerHTML = `Temp: ${temp}&#176;F`;
  humidityInfo.textContent = `Humidity: (${humidity})`;
  icon.style.backgroundImage = `url(${iconSrc + weather[0].icon}@2x.png)`;

  weatherIcon.appendChild(icon);
  cityInfo.appendChild(weatherIcon);
}

function renderForecast(data) {
  var city=data.city.name
  var lat = data.city.coord.lat;
  var lon = data.city.coord.lon;
  let { list } = data;
  list = list.reduce((acc, res) => {
    let { dt_txt } = res;
    dt_txt = dt_txt.split(" ")[0];
    if (!acc[dt_txt]) {
      acc[dt_txt] = res;
    }
    return acc;
  }, {});
  list = Object.values(list).splice(1); // For 4 days forecast excluding current
  // console.log(list)
  // list = Object.values(list);
  createAndRenderCards(list);
  saveData({ city, lat, lon });
}

function createAndRenderCards(data) {
  console.log({ data });
  const fragment = new DocumentFragment();
  data.forEach((item) => {
    // console.log(item)
    const card = createCard(item);
    fragment.append(card);
  });
  cardWrapper.innerHTML = "";
  cardWrapper.append(fragment);
}

function createCard(data) {
  const {
    main: { humidity = "", temp = "" },
    wind: { speed: wind = "" },
    weather,
    dt_txt,
  } = data;

  const iconCode = weather[0].icon;
  var iconSrc = "https://openweathermap.org/img/wn/";

  let formattedDate = dt_txt.split(" ")[0].split("-").reverse().join("/");
  const card = document.createElement("div");
  const date = document.createElement("div");
  const weatherIcon = document.createElement("div");
  const icon = document.createElement("i");
  const tempInfo = document.createElement("p");
  const windInfo = document.createElement("p");
  const humidityInfo = document.createElement("p");

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

function renderHistory(history) {
  const fragment = new DocumentFragment();
  history.forEach((city) => {
    const cityNode = document.createElement("p");
    cityNode.classList.add("city");
    cityNode.textContent = city;
    fragment.append(cityNode);
  });
  searchHistory.innerHTML = "";
  searchHistory.append(fragment);
}

function renderCurrentWeather() {
  var currentDate = new Date();
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
  return `${month}/${day}/${year}`;
}

function searchHistoryStored(city) {
  var newData = city;
  var searchHistory = document.querySelector(".search_history");

  if (searchHistory.innerHTML) {
    searchHistory.innerHTML += `<div class="column">${newData}</div>`;
  } else {
    searchHistory.innerHTML = `<div class="column">${newData}</div>`;
  }
}

searchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  console.log("button clicked");
  var cityInputValue = cityInput.value;

  if (cityInputValue == "") {
    alert("Please enter a city to search");
    return null;
  }

  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${cityInputValue}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("data is", data);
      lat = data[0]["lat"];
      lon = data[0]["lon"];
      console.log(lat, lon);
      // now that we have our latitude and longitude, let's run our function and pass in values
      fetchOneCallWeatherData(lat, lon);
      fetchForecast(lat, lon);
    })
    .catch((error) => {
      console.error("Error fetching lat and lon data:", error);
    });
});















// Pseudo Code: 
// 1. set up the html and the associated classes to mirror the wireframe. 
//         a. Will need section for the search input element as well as a button for sumbit. 
//         b. Underneath should be the section of the search history. 
//         c. Will need another section about for the curent day and weather and tempInfo, wind, and humidity 
//         d. Underneath should be a section for the 5 day forecast 
// 2. Input the API key in the javascript, bootstrap link, and jquery link. 
// 3. We need a function with a conditional statement (when the input section is filled out with a city name && the button is selected, then the data should be fetched, 
// 4. We need a function with a conditional statement (when the new city has been looked up it is saved to the screen and displayed in the search history section as a column)
// 5. We need a function with a conditional statement (when the input section is filled out with a city name && the button is selected, then the city name and current date, temp, wind, and humidity are pulled from open weather
// 6. Using the createELement and textContent properties, create divs and elements for the sections that will be filled with the updated data 
// 7. Create a function for local storage and saving the previous searches into the empty div underneath the form.