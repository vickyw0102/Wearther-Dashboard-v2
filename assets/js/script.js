let apiURL = "https://api.openweathermap.org/data/2.5/forecast?q=";
let apiKey = "c6e3c2ed3702ad6fac505841e1ac01d0";
let queryURL;
let searchBtn = $("#search-btn");
let currentWeather=$("#current-weather");
let weatherForecast=$("#five-day-forecast");
let cityName;
let cityBtn;

//store city names
let citiesArray=[];

getUserInput();
function getUserInput(){

    searchBtn.on("click", function (e) {
        e.preventDefault();
        cityName = $("#city-input").val().trim();
        if (!cityName) {
            alert("Please enter a city");
        
            return;
       
    }
    const isDuplicate = citiesArray.includes(cityName);
    
    fetchData();
    $("#city-input").val("");
    
    if (!isDuplicate) {
        citiesArray.push(cityName);
        // localStorage.setItem("cities", JSON.stringify(citiesArray));
        renderInput();

    }
    });
};

// Function to render user's search history
function renderInput() {
$("#history").empty();
// Iterate through the cities array and create buttons
for (let i = 0; i < citiesArray.length; i++) {
    cityBtn = $("<button>");
    cityBtn.text(citiesArray[i]);
    cityBtn.addClass("list-group-item mb-2 cityHistory");
    $("#history").append(cityBtn);

    // Event listener for city button click
    cityBtn.on("click", function () {
    const selectedCity = $(this).text();
    // Set the selected city as the current city and fetch data
    cityName = selectedCity;
    fetchData();
    });
}
// Store the updated city list in local storage
storeCityList();
}

// Function to store the city list in local storage
function storeCityList() {
localStorage.setItem("city-names", JSON.stringify(citiesArray));
}

// Function to convert and round temperature from Kelvin to Celsius
function kelvinToCelsius(tempK) {
// Convert Kelvin to Celsius
const tempC = tempK - 273.15;

// Round the temperature
const roundedCelsius = Math.round(tempC);
return roundedCelsius;
}

// Function to round wind speed
function roundWindSpeed(windSpeed) {
// Round the wind speed
const roundedWindSpeed = Math.round(windSpeed);
return roundedWindSpeed;
}

// Function to fetch weather data from OpenWeatherMap API
function fetchData() {
// Clear today weather section
let todaySection = $("#current-weather");
todaySection.empty();
/// Clear forecast weather section
let forecastSection = $("#five-day-forecast");
forecastSection.empty();

//  Build the API query URL based on the user input value
queryURL = apiURL + cityName + "&appid=" + apiKey;
//Fetch data from the API
fetch(queryURL) 
    .then((response) => response.json())
    .then(function (data) {
    console.log(data);

    // Populate today's weather
    const todayMain = $("<div>");
    todayMain.addClass("todayMain col-lg-12 col-md-9 col-sm-9 pb-2 mx-auto");

    const todayCardContainer = $("<div>");
    todayCardContainer.addClass("card shadow background-image");

    const todayCard = $("<div>");
    todayCard.addClass("card-body text-left");

    // Create City element as part of the title
    // Create data as a part of a title
    let dateTitleToday = data.list[0].dt_txt;
    dateTitleToday = dayjs().format("D/M/YYYY");

    let icon = data.list[0].weather[0].icon;
    let iconURL = "https://openweathermap.org/img/w/" + icon + ".png";
    let iconImage = $("<img>");
    iconImage.attr("src", iconURL);

    let todayTitle = $("<h4>");
    todayTitle.text(cityName + " (" + dateTitleToday + ")");
    todayTitle.append(iconImage);
    console.log(todayTitle);

    let temp = kelvinToCelsius(data.list[0].main.temp);
    let p1 = $("<p>").text("Temp: " + temp + " °C");
    let wind = roundWindSpeed(data.list[0].wind.speed);
    let p2 = $("<p>").text("Wind: " + wind + " KPH");
    let humidity = data.list[0].main.humidity;
    let p3 = $("<p>").text("Humidity: " + humidity + " %");

    todayCard.append(todayTitle);
    todayCard.append(p1, p2, p3);
    todayCardContainer.append(todayCard);
    
    todayMain.append(todayCardContainer);
    
    currentWeather.append(todayMain);

    // Group forecast data by day
    const dailyForecast = {};
    // Iterate through the results and group data by day
    for (let i = 0; i < data.list.length; i++) {
        const date = dayjs(data.list[i].dt_txt).format("ddd, DD MMM");
        if (!dailyForecast[date]) {
        dailyForecast[date] = data.list[i];
        }
    }

    // Populate #forecast
    // Create a card container
    let cardCount = 0; // Counter variable

    const forecastText = $("<h4>").text("5-Day Forecast:");
    forecastText.addClass("text-left forecastText");
    weatherForecast.append(forecastText);

    for (const date in dailyForecast) {
        // Skip today's forecast
        if (cardCount === 0 && dayjs(date).isSame(dayjs(), "day")) {
        continue;
        }

        if (cardCount >= 5) {
        break; // Exit the loop after creating 5 cards
        }
        const dailyData = dailyForecast[date];
        const cardMain = $("<div>");
        cardMain.addClass("cardMain col-lg col-md-4 col-sm-6 mb-3");

        const cardContainer = $("<div>");
        cardContainer.addClass("card align-items-center shadow custom-card");

        // Create a card body
        const cardBody = $("<div>");
        cardBody.addClass("card-body forecast-card");

        let forecastTitle = $("<h5>");
        forecastTitle.addClass("card-title");

        let dateForecast = dailyData.dt_txt;
        dateForecast = dayjs(dateForecast).format("D/M/YYYY");
        forecastTitle.text(dateForecast);

        // Create a card icon
        let iconForecast = dailyData.weather[0].icon;
        let iconForecastURL =
        "https://openweathermap.org/img/w/" + iconForecast + ".png";
        let iconImageForecast = $("<img>");
        iconImageForecast.attr("src", iconForecastURL);

        // Create a card text (p)
        const cardP1 = $("<p>");
        let tempForecast = kelvinToCelsius(dailyData.main.temp);
        cardP1.addClass("card-text1");
        cardP1.text("Temp: " + tempForecast + " °C");

        const cardP2 = $("<p>");
        let windForecast = roundWindSpeed(dailyData.wind.speed);
        cardP2.addClass("card-text2");
        cardP2.text("Wind: " + windForecast + " KPH");

        const cardP3 = $("<p>");
        let humidityForecast = dailyData.main.humidity;
        cardP3.addClass("card-text2");
        cardP3.text("Humidity: " + humidityForecast + " %");

        forecastTitle.append(iconImageForecast);
        // Append title and text to card body
        cardBody.append(forecastTitle);
        cardBody.append(cardP1, cardP2, cardP3);

        // Append card body to card container
        cardContainer.append(cardBody);

        cardMain.append(cardContainer);

        // Append the card to the forecast section
        weatherForecast.append(cardMain);

        cardCount++; // Increment the counter
    }
    })

    // .catch(function (error) {
    // console.error("Error:", error);
    // });
    
}