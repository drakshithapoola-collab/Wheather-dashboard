// Get HTML elements

const cityInput =
    document.getElementById("cityInput");

const searchButton =
    document.getElementById("searchButton");

const weatherCard =
    document.getElementById("weatherCard");

const cityName =
    document.getElementById("cityName");

const temperature =
    document.getElementById("temperature");

const condition =
    document.getElementById("condition");

const humidity =
    document.getElementById("humidity");

const wind =
    document.getElementById("wind");

const feelsLike =
    document.getElementById("feelsLike");

const weatherIcon =
    document.getElementById("weatherIcon");

const errorMessage =
    document.getElementById("errorMessage");

const loading =
    document.getElementById("loading");


// Open-Meteo API

const geocodingURL =
    "https://geocoding-api.open-meteo.com/v1/search";

const weatherURL =
    "https://api.open-meteo.com/v1/forecast";


// Search button

searchButton.addEventListener(
    "click",
    getWeather
);


// Press Enter to search

cityInput.addEventListener(
    "keypress",
    function(event) {

        if (event.key === "Enter") {
            getWeather();
        }

    }
);


// Main weather function

async function getWeather() {

    const city =
        cityInput.value.trim();


    // Validate input

    if (city === "") {

        showError(
            "Please enter a city name."
        );

        return;
    }


    // Show loading

    loading.style.display = "block";

    weatherCard.style.display = "none";

    errorMessage.style.display = "none";


    try {

        // Step 1:
        // Find city coordinates

        const geoResponse =
            await fetch(
                `${geocodingURL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
            );


        if (!geoResponse.ok) {

            throw new Error(
                "Unable to find the city."
            );
        }


        const geoData =
            await geoResponse.json();


        // Check whether city exists

        if (
            !geoData.results ||
            geoData.results.length === 0
        ) {

            throw new Error(
                "City not found. Please enter a valid city name."
            );
        }


        const location =
            geoData.results[0];


        const latitude =
            location.latitude;

        const longitude =
            location.longitude;


        // Step 2:
        // Get weather data

        const weatherResponse =
            await fetch(
                `${weatherURL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
            );


        if (!weatherResponse.ok) {

            throw new Error(
                "Unable to get weather data."
            );
        }


        const weatherData =
            await weatherResponse.json();


        // Display weather

        displayWeather(
            location,
            weatherData
        );


    } catch (error) {

        // Error handling

        showError(
            error.message
        );


    } finally {

        // Hide loading

        loading.style.display = "none";
    }
}


// Display weather

function displayWeather(
    location,
    weatherData
) {

    const current =
        weatherData.current;


    // City

    cityName.textContent =
        `${location.name}, ${location.country_code}`;


    // Temperature

    temperature.textContent =
        `${current.temperature_2m}°C`;


    // Humidity

    humidity.textContent =
        `${current.relative_humidity_2m}%`;


    // Wind

    wind.textContent =
        `${current.wind_speed_10m} km/h`;


    // Feels like

    feelsLike.textContent =
        `${current.apparent_temperature}°C`;


    // Weather condition

    const weather =
        getWeatherDescription(
            current.weather_code
        );


    condition.textContent =
        weather.description;


    weatherIcon.textContent =
        weather.icon;


    // Show card

    weatherCard.style.display =
        "block";
}


// Convert WMO weather codes
// into descriptions and icons

function getWeatherDescription(code) {

    if (code === 0) {

        return {
            description: "Clear Sky",
            icon: "☀️"
        };

    }


    if (
        code === 1 ||
        code === 2 ||
        code === 3
    ) {

        return {
            description: "Partly Cloudy",
            icon: "⛅"
        };

    }


    if (
        code === 45 ||
        code === 48
    ) {

        return {
            description: "Foggy",
            icon: "🌫️"
        };

    }


    if (
        code >= 51 &&
        code <= 67
    ) {

        return {
            description: "Rain",
            icon: "🌧️"
        };

    }


    if (
        code >= 71 &&
        code <= 77
    ) {

        return {
            description: "Snow",
            icon: "❄️"
        };

    }


    if (
        code >= 80 &&
        code <= 82
    ) {

        return {
            description: "Rain Showers",
            icon: "🌦️"
        };

    }


    if (
        code >= 95
    ) {

        return {
            description: "Thunderstorm",
            icon: "⛈️"
        };

    }


    return {
        description: "Unknown Weather",
        icon: "🌤️"
    };
}


// Error function

function showError(message) {

    errorMessage.textContent =
        message;

    errorMessage.style.display =
        "block";

    weatherCard.style.display =
        "none";
}
