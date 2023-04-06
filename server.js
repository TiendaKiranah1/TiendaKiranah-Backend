const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.MONGO_URI.replace("<password>", process.env.PASSWORD);
const port = process.env.PORT || 5000;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log(`DB CONNECTION SUCCESSFUL`);
  })
  .catch((e) => {
    console.log(e.message);
  });

app.listen(port, "localhost", () => {
  console.log(`App running on port: ${port}...`);
});
