const router = require("express").Router();

router.get("/users/", (req) => {
  return req.params.users;
});

router.get("/users/:id", (req) => {
  return req.params.users;
});

module.exports = router;
