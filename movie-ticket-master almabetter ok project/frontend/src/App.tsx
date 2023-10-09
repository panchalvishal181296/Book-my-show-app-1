import { useState, SetStateAction, useEffect } from "react";
import "./App.css";
import { movies, slots, seats } from "./data";

function App() {
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedSeat, setSelectedSeat] = useState("");
  const [totalSeat, setTotalSeat] = useState({
    A1: 0,
    A2: 0,
    A3: 0,
    A4: 0,
    D1: 0,
    D2: 0,
  });

  const [bookingData, setBookingData] = useState({
    movie: "",
    slot: "",
    seats: {
      A1: 0,
      A2: 0,
      A3: 0,
      A4: 0,
      D1: 0,
      D2: 0,
    },
  });

  useEffect(() => {
    const slot = JSON.parse(localStorage.getItem("slot") as string);
    if (slot) {
      setSelectedSlot(slot);
    }
    const seat = JSON.parse(localStorage.getItem("seat") as string);
    if (seat) {
      setSelectedSeat(seat);
    }

    const totalseat = JSON.parse(localStorage.getItem("totalseat") as string);
    if (totalseat) {
      setTotalSeat(totalseat);
    }
  }, [selectedMovie]);

  useEffect(() => {
    fetch("https://movie-ticket-ovzt.onrender.com/api/booking")
      .then((response) => response.json())
      .then((data) => {
        // Extract the required data from the API response
        const { movie, slot, seats } = data;
        setBookingData({ movie, slot, seats });
      });
  }, []);

  const handleMovieClick = (name: string | SetStateAction<string>) => {
    setSelectedMovie(name === selectedMovie ? "" : name);
  };

  useEffect(() => {
    localStorage.setItem("movie", JSON.stringify(selectedMovie));
  }, [selectedMovie]);

  const handleSlotClick = (slot: SetStateAction<string>) => {
    setSelectedSlot(slot === selectedSlot ? "" : slot);
  };

  useEffect(() => {
    localStorage.setItem("slot", JSON.stringify(selectedSlot));
  }, [selectedSlot]);

  const handleSeatClick = (seat: SetStateAction<string>) => {
    setSelectedSeat(seat === selectedSeat ? "" : seat);
  };

  const handleSeatChange = (seat: string, value: number) => {
    setTotalSeat((prevTotalSeat) => ({
      ...prevTotalSeat,
      [seat]: value,
    }));
  };

  useEffect(() => {
    localStorage.setItem("totalseat", JSON.stringify(totalSeat));
  }, [totalSeat]);

  const bookMovie = () => {
    console.log("Movie = " + selectedMovie);
    console.log("Slot = " + selectedSlot);
    console.log("total Seat = " + totalSeat);
    fetch("https://movie-ticket-ovzt.onrender.com/api/booking", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        movie: selectedMovie,
        slot: selectedSlot,
        seats: totalSeat,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          alert("Booking Created Successfully");
        }
      })
      .catch((error) => {
        console.log(error);
      });

    setSelectedMovie("");
    setSelectedSlot("");
    setTotalSeat({
      A1: 0,
      A2: 0,
      A3: 0,
      A4: 0,
      D1: 0,
      D2: 0,
    });
    localStorage.clear();
  };

  return (
    <div className="container">
      <div>
        <h2>Book That Show!!</h2>
        {/* Movie Selection */}
        <div className="movie-row">
          <h2>Select A Movie</h2>
          {movies?.map((name, index) => (
            <div
              className={`movie-column ${
                selectedMovie === name ? "movie-column-selected" : ""
              }`}
              key={index}
              onClick={() => handleMovieClick(name)}
            >
              <p>{name}</p>
            </div>
          ))}
        </div>
        {/* Slot Selection */}
        <div className="slot-row">
          <h2>Select A Time Slot</h2>
          {slots?.map((slot, index) => (
            <div
              className={`slot-column ${
                selectedSlot === slot ? "slot-column-selected" : ""
              }`}
              key={index}
              onClick={() => handleSlotClick(slot)}
            >
              <p>{slot}</p>
            </div>
          ))}
        </div>
        {/* Seat Selection */}
        <div className="seat-row">
          <h2>Select A Time Slot</h2>
          {seats?.map((seat, index) => (
            <div
              className={`seat-column ${
                selectedSeat === seat ? "seat-column-selected" : ""
              }`}
              key={index}
              onClick={() => handleSeatClick(seat)}
            >
              <p>Type{seat}</p>
              <input
                type="number"
                id={`seat-${seat}`}
                onChange={(e) =>
                  handleSeatChange(seat, parseInt(e.target.value))
                }
                className="input"
              />
            </div>
          ))}
        </div>
        <button onClick={bookMovie}>Book Now</button>
      </div>
      <div className="last-order">
        {bookingData.movie ? (
          <>
            <h2>Last Bookings Details : </h2>
            <p>
              <strong>seats</strong>
            </p>

            <p>
              <strong>A1:</strong>
              {bookingData?.seats.A1}
            </p>
            <p>
              <strong>A2:</strong>
              {bookingData?.seats.A2}
            </p>
            <p>
              <strong>A3:</strong>
              {bookingData?.seats.A3}
            </p>
            <p>
              <strong>A4:</strong>
              {bookingData?.seats.A4}
            </p>
            <p>
              <strong>D1:</strong>
              {bookingData?.seats.D1}
            </p>
            <p>
              <strong>D2:</strong>
              {bookingData?.seats.D2}
            </p>
            <p>
              <strong>slot:</strong>
              {bookingData?.slot}
            </p>
            <p>
              <strong>movie:</strong>
              {bookingData?.movie}
            </p>
          </>
        ) : (
          <h2>No previous booking found</h2>
        )}
      </div>
    </div>
  );
}

export default App;
