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

const Login =  async (req, res, next) => {
  const { AdminId, password } = req.body;
  try {
    if (!AdminId || !password) {
      return resp(res, 400, { msg: "빈칸을 입력해주세요" });
    }
    const user = await User.findOne({ where: { AdminId } });
    if (!user) {
      return resp(res, 400, { msg: "일치하는 계정을 찾을 수 없습니다" });
    }
    if (user.password === password) {
      req.session.AdminId = AdminId;
      return resp(res, 200, { msg: "로그인 성공" });
    }
    return resp(res, 400, { msg: "일치하는 계정을 찾을 수 없습니다" });
  } catch (e) {
    return next(e);
  }
};

const Logout = (req, res, next) => {
  try {
    req.session.destroy();
    return resp(res, 200, { msg: "로그아웃 성공" });
  } catch (e) {
    return next(e);
  }
};


module.exports = {
  Join,
  Login,
  Logout,
}