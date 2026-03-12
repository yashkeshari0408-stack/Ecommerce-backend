const express = require("express");

const app = express();

app.use(express.json());
app.use('/auth', require('./routes/authRoutes'));


// app.get("/health", (req, res) => {
//   res.send("API is running");
// });

module.exports = app;

