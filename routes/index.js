const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const ERROR_STATUS = require("../utils/errors");
const { login, createUser } = require("../controllers/users");

router.post("/signin", login);
router.post("/signup", createUser);

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(ERROR_STATUS.NOT_FOUND).json({
    message: "Requested resource not found",
  });
});

module.exports = router;
