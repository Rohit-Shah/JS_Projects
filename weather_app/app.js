const weatherImage = document.querySelector('.weather-image');
const temperature = document.querySelector('.temperature');
const weatherType = document.querySelector('.weather-type');
const place = document.querySelector('.place');
const baseUrl = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = "47c47a71fbafffba070dd4a30af715ed";
const inputCity = document.querySelector('.city-input');
const submitBtn = document.querySelector('.btn');
const alert = document.querySelector('.alert');
weatherType.src = './icons/unknown.png'

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(getPosition, showError);
}
else {
    showAlert('Geolocation is not supported');
}

function showError(error) {
    showAlert(error.message);
}

function getPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    getWeatherByCordinates(lat, lon).then(data => {
        displayWeatherByCord(data);
    })
}

async function getWeatherByCordinates(lat, lon) {
    try {
        let data = await fetch(baseUrl + `?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        let parsedData = await data.json();
        return parsedData;
    } catch (error) {
        console.log(error.message);
    }
}

function displayWeatherByCord(data) {
    let temp = data.main.temp;
    let cityWeather = data.weather[0].main;
    let icon = data.weather[0].icon;
    let degreeCelcius = (temp - 273);
    temperature.textContent = `${degreeCelcius.toFixed(2)}°C`;
    weatherType.textContent = cityWeather;
    place.textContent = data.name;
    weatherImage.src = `./icons/${icon}.png`
}

async function getWeatherData(city) {
    try {
        let data = await fetch(baseUrl + `?q=${city}&appid=${apiKey}`);
        if (data.status === 404) {
            showAlert('city not found');
            return;
        }
        else {
            let parsedData = data.json();
            return parsedData;
        }

    } catch (error) {
        console.log(error);
    }

}

submitBtn.addEventListener('click', () => {
    let inputVal = inputCity.value;
    if (!inputVal) {
        showAlert('Please Enter Some City To Search');
    }
    else {
        displayWeather(inputVal);
    }
})

function displayWeather(inputVal) {
    getWeatherData(inputVal).then(data => {
        if (data !== undefined) {
            let temp = data.main.temp;
            let cityWeather = data.weather[0].main;
            let icon = data.weather[0].icon;
            let degreeCelcius = (temp - 273);
            temperature.textContent = `${degreeCelcius.toFixed(2)}°C`;
            weatherType.textContent = cityWeather;
            place.textContent = inputVal;
            weatherImage.src = `./icons/${icon}.png`
            inputCity.value = "";
        }

    })
}

function showAlert(alertMsg) {
    alert.textContent = alertMsg;
    alert.classList.add('show-alert');
    setTimeout(() => {
        alert.classList.remove('show-alert');
    }, 1500);
}