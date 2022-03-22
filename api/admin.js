const resp = require("../service/response");

const {
  User,
  Sequelize: { Op },
} = require("../models");


const Join = async (req, res, next) => {
  const {
    AdminId,
    password,
  } = req.body;
  
  let user;
  try {
    const existAdmin = await User.findOne({
      where: { [Op.or]: [{ AdminId }] },
    });
    if (existAdmin) {
      return resp(res, 409, { msg: "이미 존재하는 관리자입니다" });
    };

    user = await User.create({
      AdminId,
      password,
    });
    if (!AdminId || !password) {
      return resp(res, 400, { msg: "빈칸을 채워주세요" });
    };
    user = await User.create({
      AdminId,
      password,
    });
    if (user) {
      return resp(res, 200, { msg: "가입 완료" });
    }
    return resp(res, 404, { msg: "잘못된 접근입니다" });
  } catch (e) {
    return next(e);
  }
};


module.exports = {
  Join,
}