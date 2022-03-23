const router = require("express").Router();

const {
  Join,
  Login,
  Logout,
  CreateRecruit,
  ReadRecruit,
  UpdateRecruit,
  DeleteRecruit,
  CreateNewsRoom,
  ReadNewsRoom,
  UpdateNewsRoom,
  DeleteNewsRoom,
  CreateClientImage,
  ReadClientImage,
  DeleteClientImage,
} = require("../api/admin");
const { newsRoomFileUpload } = require("../services/upload");

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

  .post("/CreateRecruit", async (req, res, next) => {
    await CreateRecruit(req, res, next);
  })

  .get("/ReadRecruit", async (req, res, next) => {
    await ReadRecruit(req, res, next);
  })

  .post("/UpdateRecruit", async (req, res, next) => {
    await UpdateRecruit(req, res, next);
  })

  .post("/DeleteRecruit", async (req, res, next) => {
    await DeleteRecruit(req, res, next);
  })

  .post("/CreateNewsRoom", newsRoomFileUpload, async (req, res, next) => {
    await CreateNewsRoom(req, res, next);
  })

  .get("/ReadNewsRoom", async (req, res, next) => {
    await ReadNewsRoom(req, res, next);
  })

  .post("/UpdateNewsRoom", newsRoomFileUpload, async (req, res, next) => {
    await UpdateNewsRoom(req, res, next);
  })

  .post("/DeleteNewsRoom", async (req, res, next) => {
    await DeleteNewsRoom(req, res, next);
  })

  .post("/CreateClientImage", async (req, res, next) => {
    await CreateClientImage(req, res, next);
  })

  .get("/ReadClientImage", async (req, res, next) => {
    await ReadClientImage(req, res, next);
  })

  .post("/DeleteClientImage", async (req, res, next) => {
    await DeleteClientImage(req, res, next);
  })

  
module.exports = router;