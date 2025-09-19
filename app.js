const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { login, createUser } = require("./controllers/users");
const { auth } = require("../middlewares/auth");

const app = express();
const { PORT = 3001 } = process.env;

const mainRouter = require("./routes/index");

app.use(express.json());
app.use(cors());
app.use(auth);

app.post("/signin", login);
app.post("/signup", createUser);

app.use("/", mainRouter);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connected to the db");
  })
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`app is listening on ${PORT}`);
});
