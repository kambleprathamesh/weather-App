const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const WeatherContainer = document.querySelector(".container");
const GrantLocation = document.querySelector(".grant-loaction");
const SearchForm = document.querySelector(".search-weather-Form");
const LoadingGif = document.querySelector(".loading-conatiner");

const UserWeatherInformation = document.querySelector(".user-info-container");

let currentTab = userTab;
currentTab.classList.add("current-Tab");
const API_key = "80f0d5da7647cc89357471fa2ed12d11";
getFromSessionStorage();


function SwitchTab(clickedTab) {
  if (clickedTab != currentTab) {
    // console.log(clickedTab);
    currentTab.classList.remove("current-Tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-Tab");
    //  if the switching is to be done on searchTab;
    if (!SearchForm.classList.contains("Active")) {
      UserWeatherInformation.classList.remove("Active");
      GrantLocation.classList.remove("Active");
      SearchForm.classList.add("Active");
    } else {
      // agar we want the UserInformation Tab
      SearchForm.classList.remove("Active");
      UserWeatherInformation.classList.remove("Active");
      getFromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  // passes clicked tab as Input
  SwitchTab(userTab);
});

searchTab.addEventListener("click", () => {
  // passes clicked tab as Input
  SwitchTab(searchTab);
});

//Session Storage
function getFromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-cordinates");
  if (!localCoordinates) {
    // if localCoordinates of user not present then call the grant acces location page
    GrantLocation.classList.add("Active");
  } else {
    // if coordinates are prsent then parse tghe user coordinates into jason format
    const coordinates = JSON.parse(localCoordinates);
    // then call the function fetch user weather information
    fetchUserWeatherInfo(coordinates);
  }
}
async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  // hide the Loaction grant page
  GrantLocation.classList.remove("Active");
  //make the loading page (logo) Active
  LoadingGif.classList.add("Active");
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`
    );
    const data = await response.json();
    LoadingGif.classList.remove("Active");
    UserWeatherInformation.classList.add("Active");
    renderWeatherInfo(data);
  } catch (error) {
    LoadingGif.classList.remove("Active");
  }
}

// render Data on UI
function renderWeatherInfo(weatherInfo) {
  const city = document.querySelector("[data-city-name]");
  const CountryFlag = document.querySelector("[data-country-icon]");
  const DataWeatherDescp = document.querySelector(".data-weather-descp");
  const WeatherIcon = document.querySelector("[data-weather-icon]");
  const Temperature = document.querySelector("[data-weather-temp]");
  const windSpeed = document.querySelector("[data-windSpeed]");
  const Humidity = document.querySelector("[data-Humidity]");
  const Cloudy = document.querySelector("[data-Cloudy]");
  city.innerText = weatherInfo?.name;
  CountryFlag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  DataWeatherDescp.innerText = weatherInfo?.weather?.[0]?.description;
  WeatherIcon.src = `https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}.png`;
  Temperature.innerText = `${weatherInfo?.main?.temp}°C`;
  windSpeed.innerText =`${weatherInfo?.wind?.speed} m/s` ;
  Humidity.innerText = `${weatherInfo?.main?.humidity} %`;
  Cloudy.innerText =`${weatherInfo?.clouds?.all} %`;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geo Location Not supported");
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  sessionStorage.setItem("user-cordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

const GrantAccesButton = document.querySelector("#btn");
GrantAccesButton.addEventListener("click", getLocation);

// Search Input Operations

const searchInput = document.querySelector("[search-input]");

async function getWeatherInfo(cityName) {
  LoadingGif.classList.add("Active");
  UserWeatherInformation.classList.remove("Active");
  GrantLocation.classList.remove("Active");
  try {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_key}`
    );
    let data = await response.json();
    LoadingGif.classList.remove("Active");
    UserWeatherInformation.classList.add("Active");
    renderWeatherInfo(data);
  } catch (e) {

  }
}
SearchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;
  if (cityName === "") {
    return;
  } else {
    getWeatherInfo(cityName);
  }
});
