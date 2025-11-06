const fs = require("fs").promises;
const EventEmitter = require("events");

const weatherEvent = new EventEmitter();

async function fetchWeatherData() {
  console.log("Fetching weather data...");

  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const data = await fs.readFile("./weather.json", "utf-8");
        const weather = JSON.parse(data);
        resolve(weather);
      } catch (err) {
        reject("Error reading weather data!");
      }
    }, 2000); 
  });
}

async function displayWeather() {
  try {
    const weather = await fetchWeatherData();

    weatherEvent.emit("dataFetched", weather);

  } catch (error) {
    console.error(error);
  }
}

weatherEvent.on("dataFetched", (data) => {
  console.log("\nWeather Report:");
  console.log(`-----------------------`);
  console.log(`City: ${data.city}`);
  console.log(`Temperature: ${data.temperature}°C`);
  console.log(`Condition: ${data.condition}`);
  console.log(`Humidity: ${data.humidity}%`);
  console.log(`Wind Speed: ${data.wind_speed} km/h`);
  console.log(`-----------------------\n`);
});

displayWeather();
