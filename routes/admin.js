const router = require("express").Router();

const {
  Join,
  Login,
  Logout,
} = require("../api/admin");

router

  .post("/Join", async (req, res, next) => {
    await Join(req, res, next);
  })

  .post("/Login", async (req, res, next) => {
    await Login(req, res, next);
  })

  .get("/Logout", async (req, res, next) => {
    await Logout(req, res, next);
  })

module.exports = router;