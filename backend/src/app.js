const express = require('express');

const cors = require("cors");

const routeRouter = require("./routes/route.routes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/routes", routeRouter);

module.exports = app;