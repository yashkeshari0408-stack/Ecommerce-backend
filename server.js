require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

console.log("ENV PORT:", process.env.PORT);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



