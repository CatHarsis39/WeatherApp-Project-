// date

function formatDate() {
  let currentTime = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let dayIndex = days[currentTime.getDay()];
  let currentMonth = months[currentTime.getMonth()];
  let currentDate = currentTime.getDate();
  let currentYear = currentTime.getFullYear();
  let currentHour = currentTime.getHours();
  let currentMinutes = currentTime.getMinutes();
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }

  if (currentHour < 10) {
    currentHour = `0${currentHour}`;
  }

  let sentenceDate = `Today | ${dayIndex} ${currentDate}, ${currentMonth} ${currentYear}`;

  let changeTodayDate = document.querySelector("#today-date");
  changeTodayDate.innerHTML = sentenceDate;

  let changeUpdate = document.querySelector("#last-update");
  changeUpdate.innerHTML = `Last updated ${currentHour}: ${currentMinutes}`;
}

formatDate();

// Format date for forecast

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

// forecast

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#bubblesForecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
            <div class="bubble">
              <div id="days-name">${formatDay(forecastDay.dt)}</div>
              <div id="weather-image"><img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="40"
        /></div>
              <div id="highest-temp">${Math.round(forecastDay.temp.max)}º</div>
              <div id="lowest-temp">${Math.round(forecastDay.temp.min)}º</div>
            </div>
          </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

// Weather Info

function getForecast(coordinates) {
  let key = "9da2f08caa2513afeb23e54674daaf04";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${key}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showTemperatureInHtml(response) {
  document.querySelector("h1").innerHTML = response.data.name;
  document.querySelector("#temp-num").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#weather").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#temp-min").innerHTML = Math.round(
    response.data.main.temp_min
  );
  document.querySelector("#temp-max").innerHTML = Math.round(
    response.data.main.temp_max
  );
  document.querySelector("#real").innerHTML = Math.round(
    response.data.main.feels_like
  );

  let iconElement = document.querySelector("#icon");

  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  iconElement.setAttribute("alt", response.data.weather[0].description);

  celsiusTemperature = response.data.main.temp;

  getForecast(response.data.coord);
}

function getApiInfo(city) {
  let key = "9da2f08caa2513afeb23e54674daaf04";
  let endPoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;
  axios.get(`${endPoint}&appid=${key}`).then(showTemperatureInHtml);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value; // from input in html

  getApiInfo(city);
}

let searchedCity = document.querySelector("#city-form");
searchedCity.addEventListener("submit", handleSubmit);

// geolocation

function searchLocation(position) {
  let key = "9da2f08caa2513afeb23e54674daaf04";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${key}&units=metric`;
  axios.get(apiUrl).then(showTemperatureInHtml);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

// Default city when page is loading

getApiInfo("Seoul");
