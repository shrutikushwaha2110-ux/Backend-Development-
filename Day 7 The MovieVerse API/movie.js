
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(express.json());


const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "cineCriticDB";

let db, movies;


function loggerMiddleware(req, res, next) {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
}


async function validateMovieMiddleware(req, res, next) {
  const { title, category, releaseYear, rating, isFeatures } = req.body;


  if (!title || !category || rating === undefined || releaseYear === undefined) {
    return res
      .status(400)
      .json({ message: "Validation failed: Invalid rating or year." });
  }

 
  if (
    typeof title !== "string" ||
    typeof category !== "string" ||
    typeof releaseYear !== "number" ||
    typeof rating !== "number" ||
    (isFeatures !== undefined && typeof isFeatures !== "boolean")
  ) {
    return res
      .status(400)
      .json({ message: "Validation failed: Invalid rating or year." });
  }

  if (rating < 0 || rating > 10 || releaseYear < 1900) {
    return res
      .status(400)
      .json({ message: "Validation failed: Invalid rating or year." });
  }


  const existing = await movies.findOne({
    title: { $regex: `^${title}$`, $options: "i" },
  });

  
  if (req.method === "POST" && existing) {
    return res
      .status(400)
      .json({ message: "Validation failed: Invalid rating or year." });
  }

 
  if (req.method === "PUT" && existing) {
    if (existing._id.toString() !== req.params.id) {
      return res
        .status(400)
        .json({ message: "Validation failed: Invalid rating or year." });
    }
  }

  next();
}


function errorHandlerMiddleware(err, req, res, next) {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
}


async function connectDB() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB server");
    db = client.db(dbName);
    movies = db.collection("movies");
  } catch (err) {
    console.error(" Failed to connect to MongoDB:", err);
  }
}
connectDB();


app.use(loggerMiddleware);

app.get("/", (req, res) => {
  res.send(" Welcome to the CineCritic Movie API!");
});


app.post("/api/movies", validateMovieMiddleware, async (req, res) => {
  const { title, category, releaseYear, rating, isFeatures = false } = req.body;
  const newMovie = { title, category, releaseYear, rating, isFeatures };

  const result = await movies.insertOne(newMovie);
  res.status(201).json({ message: "Movie added", id: result.insertedId });
});


app.get("/api/movies", async (req, res) => {
  const all = await movies.find({}).toArray();
  res.status(200).json(all);
});


app.get("/api/movies/:id", async (req, res) => {
  try {
    const movie = await movies.findOne({ _id: new ObjectId(req.params.id) });
    if (!movie) return res.status(404).json({ message: "Not Found" });
    res.status(200).json(movie);
  } catch (err) {
    res.status(400).json({ message: "Invalid ID format" });
  }
});


app.put("/api/movies/:id", validateMovieMiddleware, async (req, res) => {
  const { title, category, releaseYear, rating, isFeatures } = req.body;
  try {
    const result = await movies.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { title, category, releaseYear, rating, isFeatures } }
    );
    if (result.matchedCount === 0)
      return res.status(404).json({ message: "Not Found" });
    res.json({ message: "Movie updated" });
  } catch (err) {
    res.status(400).json({ message: "Invalid ID format" });
  }
});


app.delete("/api/movies/:id", async (req, res) => {
  try {
    const result = await movies.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Not Found" });
    res.json({ message: "Movie deleted" });
  } catch (err) {
    res.status(400).json({ message: "Invalid ID format" });
  }
});


app.get("/api/movies/top-rated", async (req, res) => {
  const top = await movies.find({ rating: { $gte: 8.5 } }).toArray();
  res.status(200).json(top);
});


app.get("/api/movies/category/:category", async (req, res) => {
  const { category } = req.params;
  const filtered = await movies
    .find({ category: { $regex: `^${category}$`, $options: "i" } })
    .toArray();
  res.status(200).json(filtered);
});


app.use(errorHandlerMiddleware);

app.listen(3000, () => {
  console.log("CineCritic API running at http://localhost:3000");
});
