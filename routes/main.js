const router = require("express").Router();

const {
  ReadRecruit,
  ReadRecruitOne,
  ReadNewsRoom,
  ReadNewsRoomOne,
  ReadClientImage,
} = require("../api/main");

router
  .get("/ReadRecruit", async (req, res, next) => {
    await ReadRecruit(req, res, next);
  })

  .get("/ReadRecruitOne/:id", async(req,res,next) => {
    await ReadRecruitOne(req, res, next);
  })

  .post("/ReadNewsRoom", async (req, res, next) => {
    await ReadNewsRoom(req, res, next);
  })

  .get("/ReadNewsRoomOne/:id", async(req,res,next) => {
    await ReadNewsRoomOne(req, res, next);
  })

  .get("/ReadClientImage", async (req, res, next) => {
    await ReadClientImage(req, res, next);
  })
  
module.exports = router;