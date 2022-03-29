const resp = require("../services/response");
const { StringHash } = require("../services/hashing");

const {
  User,
  Recruit,
  NewsRoom,
  NewsRoomFile,
  ClientImage,
  Sequelize: { Op },
} = require("../models");


const ReadRecruit = async (req, res, next) => {
  try {
  const recruits = await Recruit.findAll({});
  return resp(res, 200, recruits);
  } catch (e) {
    return next(e);
  }
};

const ReadRecruitOne = async (req,res,next) => {
  const { id } = req.params;
  try {
    const recruit = await Recruit.findOne({
      where: { id },
    });
    if (recruit) {
      return resp(res, 200, recruit);
    }
    return resp(res, 400, { msg: "잘못된 접근입니다" });
  } catch (e) {
    return next(e);
  }
}

const ReadNewsRoom = async (req, res, next) => {
  try {
  const newsrooms = await NewsRoom.findAll({
    include: [
      {
        model: NewsRoomFile,
        attributes: ["originalname", "filename"],
      },
    ],
  });
  if (newsrooms) {
      return resp(res, 200, newsrooms);
    }
    return resp(res, 404, { msg: "잘못된 접근입니다" });
  } catch (e) {
    return next(e);
  }
};

const ReadNewsRoomOne = async (req, res, next) => {
  const { id } = req.params;

  try {
    const newsroom = await NewsRoom.findOne({
      where: { id },
      include: [
        {
          model: NewsRoomFile,
          attributes: ["originalname", "filename"],
        },
      ],
    });
    if (newsroom) {
      return resp(res, 200, newsroom);
    }
    return resp(res, 400, { msg: "잘못된 접근입니다" });
  } catch (e) {
    return next(e);
  }
}

const ReadClientImage = async (req, res, next) => {
  try {
    const clientImages = await ClientImage.findAll({});
    return resp(res, 200, clientImages);
  } catch (e) {
    return next(e);
  }
};


module.exports = {
  ReadRecruit,
  ReadRecruitOne,
  ReadNewsRoom,
  ReadNewsRoomOne,
  ReadClientImage,
}