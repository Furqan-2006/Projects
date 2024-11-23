const API_KEY = 'ab4b5d0536a93cb826c47a185562f2c4';

const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherCard = document.getElementById('weather-card');
const cityName = document.getElementById('city-name');
const weatherStatus = document.getElementById('weather-status');
const temperature = document.getElementById('temperature');
const weatherIcon = document.getElementById('weather-icon');

const fetchWeather =  async () => {
    const city = cityInput.value.trim();
    if (!city) {
        alert('Please enter a city name!');
        return;
    }

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );
        const data = await response.json();

        if (response.ok) {
            cityName.textContent = data.name;
            weatherStatus.textContent = data.weather[0].description;
            temperature.textContent = `${data.main.temp}°C`;
            weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

            weatherCard.style.display = 'block';
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Error fetching weather data. Please try again.');
        console.error(error);
    }
};

searchBtn.addEventListener('click', fetchWeather);
cityInput.addEventListener('keydown', (event)=>{
    if (event.key === 'Enter') {
        fetchWeather();
    }
})