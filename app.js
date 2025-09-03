const express = require("express");
const mongoose = require("mongoose");

const app = express();
const { PORT = 3001 } = process.env;

const mainRouter = require("./routes/index");

app.use(express.json());
app.use("/", mainRouter);

app.use((req, res, next) => {
  req.user = {
    _id: "68b8738d42c2e415e2822ada",
  };
  next();
});

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connected to the db");
  })
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`app is listening on ${PORT}`);
});
