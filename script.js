// 🌤 Weather code → icon mapping
function getWeatherIcon(code) {
    if (code === 0) return "☀️";
    if (code === 1 || code === 2) return "🌤";
    if (code === 3) return "☁️";
    if (code >= 45 && code <= 48) return "🌫";
    if (code >= 51 && code <= 57) return "🌦";
    if (code >= 61 && code <= 67) return "🌧";
    if (code >= 71 && code <= 77) return "❄️";
    if (code >= 80 && code <= 82) return "🌧";
    if (code >= 95 && code <= 99) return "⛈";
    return "🌍";
}


 //  CITY WEATHER + FORECAST

function getWeather() {
    const city = document.getElementById("cityInput").value;
    if (!city) return alert("Enter a city name");

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

    fetch(geoUrl)
        .then(res => res.json())
        .then(geoData => {
            if (!geoData.results) throw new Error("City not found");

            const { latitude, longitude, name, country } = geoData.results[0];

            const weatherUrl = `
https://api.open-meteo.com/v1/forecast?
latitude=${latitude}&longitude=${longitude}
&current_weather=true
&daily=weathercode,temperature_2m_max,temperature_2m_min
&timezone=auto`;

            return fetch(weatherUrl)
                .then(res => res.json())
                .then(data => ({ data, name, country }));
        })
        .then(result => {
            showCurrentWeather(result.data.current_weather, result.name, result.country);
            showForecast(result.data.daily);
        })
        .catch(err => {
            document.getElementById("weatherInfo").innerHTML =
                `<p style="color:red;">${err.message}</p>`;
        });
}


  // CURRENT WEATHER UI

function showCurrentWeather(weather, name, country) {
    const icon = getWeatherIcon(weather.weathercode);

    document.getElementById("weatherInfo").innerHTML = `
        <h2>${name}, ${country}</h2>
        <h1>${icon}</h1>
        <p>🌡 ${weather.temperature} °C</p>
        <p>🌬 ${weather.windspeed} km/h</p>
    `;
}


  // 5-DAY FORECAST UI

function showForecast(daily) {
    let forecastHTML = "<h3>5-Day Forecast</h3><div class='forecast-box'>";

    for (let i = 1; i <= 5; i++) {
        const date = new Date(daily.time[i]).toDateString();
        const icon = getWeatherIcon(daily.weathercode[i]);

        forecastHTML += `
            <div class="forecast-card">
                <p>${date}</p>
                <h2>${icon}</h2>
                <p>⬆ ${daily.temperature_2m_max[i]}°C</p>
                <p>⬇ ${daily.temperature_2m_min[i]}°C</p>
            </div>
        `;
    }

    forecastHTML += "</div>";
    document.getElementById("forecast").innerHTML = forecastHTML;
}


  // CURRENT LOCATION FORECAST

function getCurrentLocation() {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    navigator.geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const url = `
https://api.open-meteo.com/v1/forecast?
latitude=${lat}&longitude=${lon}
&current_weather=true
&daily=weathercode,temperature_2m_max,temperature_2m_min
&timezone=auto`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                showCurrentWeather(data.current_weather, "Your Location", "");
                showForecast(data.daily);
            });
    });
}


  // DARK / LIGHT MODE
  
const toggleBtn = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    toggleBtn.textContent = "☀️ Light Mode";
}

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        toggleBtn.textContent = "☀️ Light Mode";
        localStorage.setItem("theme", "dark");
    } else {
        toggleBtn.textContent = "🌙 Dark Mode";
        localStorage.setItem("theme", "light");
    }
});
