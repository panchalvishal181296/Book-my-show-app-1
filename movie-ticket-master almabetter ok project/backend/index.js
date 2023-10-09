const express = require("express");
const cors = require("cors");

const connection = require("./connector");
const bookMovieSchema = require("./schema");

const app = express();
const port = 8080;

//Middlewares
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: false })); //Parse URL-encoded bodies
app.use(cors());

//Model based on schema
const BookMovie = connection.model("bookmovietickets", bookMovieSchema);

app.post("/api/booking", async (req, res) => {
  const { movie, slot, seats } = req.body;

  try {
    // Create a new instance of the model with the request data
    const newBooking = new BookMovie({ movie, slot, seats });

    // Save the new booking
    await newBooking.save();

    res.status(200).json({ message: "Booking created successfully" });
  } catch (error) {
    console.error("Error while creating booking:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the booking" });
  }
});

app.get("/api/booking", async (req, res) => {
  try {
    const lastBooking = await BookMovie.findOne().sort({ _id: -1 }).limit(1);
    if (!lastBooking) {
      res.json({ message: "No Previous Booking Found" });
    }
    res.status(200).json(lastBooking);
  } catch (error) {
    console.error("Error while fetching the last booking:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the last booking" });
  }
});

app.listen(port, () =>
  console.log(`App listening on port https://localhost/${port}!`)
);
