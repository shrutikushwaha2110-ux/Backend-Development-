const fs = require("fs");
const EventEmitter = require("events");

const weatherEvent = new EventEmitter();

weatherEvent.on("fetch", () => {
  fs.readFile("./weather.json", "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading weather file:", err);
      return;
    }

    const weather = JSON.parse(data);
    console.log("Weather Report:");
    console.log(`City: ${weather.city}`);
    console.log(`Current Temperature: ${weather.temperature}°C`);
    console.log(`Condition: ${weather.condition}`);
  });
});

weatherEvent.emit("fetch");
