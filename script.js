const yourWeather = document.querySelector("[data-userWeather]");
const searchWeather = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const grantAccessButton = document.querySelector("[data-grantAccess]");
const searchForm = document.querySelector("[data-searchForm]");
const loadingContainer = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");


let oldTab = yourWeather;
oldTab.classList.add("current-tab");
const API_KEY = "aafb219cd4489e14b8dcc88e7481d874";
getFromSessionStorage();


function switchTab(newTab) {

    if (newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");
        if (!searchForm.classList.contains("active")) {

            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }

        else {
            userInfoContainer.classList.add("active");
            searchForm.classList.remove("active");
            getFromSessionStorage();
        }
    }

}


yourWeather.addEventListener("click", () => {
    switchTab(yourWeather);
});

searchWeather.addEventListener("click", () => {
    switchTab(searchWeather);
});



function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {

    const { lat, lon } = coordinates;
    grantAccessContainer.classList.remove("active");

    // API call
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        loadingContainer.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (err) {
        loadingContainer.classList.remove("active");
        
    }

}

function renderWeatherInfo(weatherInfo) {

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const weatherDiscription = document.querySelector("[data-weatherDiscription]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDiscription.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        const a = document.querySelector("[data-locationSupport]");
        a.innerHTML = "Geolocation is not supported by this browser.";
    }
}
function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

grantAccessButton.addEventListener("click", getLocation);


const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    console.log("cedecccc")
    if (cityName === ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
});

async function fetchSearchWeatherInfo(city) {
    loadingContainer.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingContainer.classList.remove("active");
        userInfoContainer.classList.add("active"); 
        renderWeatherInfo(data);

    }
    catch{
        userInfoContainer.classList.remove("active");
        console.log("iucn")

    }
}