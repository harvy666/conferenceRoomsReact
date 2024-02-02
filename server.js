//TODO start doing some react stuff

const moment = require('moment-timezone');
const express = require("express");
const path = require("path");
const pool = require("./db");
const app = express();
const port = 3000;

// incoming  json parsing (accessible on the req.body later?)
app.use(express.json());
//add static files
app.use(express.static(path.join("public")));
app.listen(port, () => console.log(`app listening on port ${port}`));
//prints all rooms from Postgres to /rooms endpoint (using a PUG in views folder)
app.set("view engine", "pug");
app.set("views", path.join("views"));

//render rooms.pug on /rooms endpoint
app.get("/rooms", (req, res) => {
  res.render("rooms");
});

//saving the checkboxes
app.post("/rooms", (req, res) => {
  const { selectedDate, room1Cb, room2Cb, room3Cb, room4Cb } = req.body;
  const sqlQuery = `INSERT INTO rooms (reservation_date,room1,room2,room3,room4) VALUES ($1,$2,$3,$4,$5)
  ON CONFLICT (reservation_date)
  DO UPDATE SET room1 = $2, room2 = $3, room3 = $4, room4 = $5
  `;
  pool.query(
    sqlQuery,
    [selectedDate, room1Cb, room2Cb, room3Cb, room4Cb],
    (error, results) => {  // eslint-disable-line no-unused-vars
      if (error) {
        console.error("Error saving checkbox state:", error);
        res.status(500).send("Error saving checkbox state");
      } else {
        res.send("Checkbox state saved successfully");
      }
    }
  );
});

app.get("/rooms/data", (req, res) => {
  const { selectedDate } = req.query;
  
  //const formattedDate = moment(selectedDate).tz('Europe/Budapest').format('YYYY-MM-DD');
  const formattedDate = moment(selectedDate, "YYYY. MM. DD.").format('YYYY-MM-DD');

  const sqlQuery = `SELECT * FROM rooms WHERE reservation_date = $1`;

  pool.query(sqlQuery, [formattedDate], (error, results) => {
    if (error) {
      console.error("Error fetching data:", error);
      res.status(500).send("Error fetching data");
    } else {
      if (results.rows.length > 0) {
        // Send the data back to the client
        res.json(results.rows[0]);
        
      } else {
        // Send an empty object if no data is found for the specified date
        res.json({});
      }
    }
  });
});




app.get("/rooms/days", (req, res) => {
  const sqlQuery = 'SELECT TO_CHAR(reservation_date, \'YYYY-MM-DD\') AS formatted_date FROM rooms';

  pool.query(sqlQuery, (error, results) => {
    if (error) {
      console.error("Error fetching data:", error);
      res.status(500).send("Error fetching data");
    } else {
      if (results.rows.length > 0) {
        // Extract formatted dates and send them to the client
        const formattedDates = results.rows.map(row => row.formatted_date);
        res.json(formattedDates);
        console.log(formattedDates);
      } else {
        // Send an empty array if no data is found
        res.json([]);
      }
    }
  });
});


