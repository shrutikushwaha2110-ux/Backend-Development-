const fs = require("fs");
const EventEmitter = require("events");

const fileEvent = new EventEmitter();

fileEvent.on("readFile", () => {
  fs.readFile("./sample.txt", "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }
    console.log("✅ File Content:");
    console.log(data);
  });
});

fileEvent.emit("readFile");
