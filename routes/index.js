const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const {
  validateUserCreation,
  validateLogin,
} = require("../middlewares/validation");
const NotFoundError = require("../errors/not-found-error");

router.post("/signin", validateLogin, login);
router.post("/signup", validateUserCreation, createUser);

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  throw new NotFoundError("Requested resource not found");
});

module.exports = router;
