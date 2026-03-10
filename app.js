const express = require("express");

const app = express();

/* middleware */
app.use(express.json());

/* routes */
app.get("/health", (req, res) => {
  res.send("API is running");
});

module.exports = app;

// app.listen(3000)