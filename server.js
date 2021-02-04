// Express to run server and routes
const express = require("express");

// Start up an instance of app
const app = express();

/* Dependencies */
const bodyParser = require("body-parser");
const cors = require("cors"); // Cors for cross origin allowance

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use(express.static("website"));

const port = 3000;

const server = app.listen(port, () => {
  console.log(`running on http://localhost:${port}`);
});

const projectData = {};

app.post("/store", (req, res) => {
  const data = req.body;
  projectData.date = data.date;
  projectData.temperature = data.temperature;
  projectData.userResponse = data.userResponse;
  projectData.apiResponse = data.apiResponse;
  res.send(projectData);
});

app.get("/all", (req, res) => {
  res.send(projectData);
});
