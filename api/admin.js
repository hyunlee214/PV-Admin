const resp = require("../services/response");

const {
  User,
  Recruit,
  NewsRoom,
  NewsRoomFile,
  ClientImage,
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

const Login = async (req, res, next) => {
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

// 채용 공고글 등록
const CreateRecruit = async (req, res, next) => {
  const {
    type,
    fullType,
    startDate,
    endDate,
    tag,
    content,
  } = req.body;
  const { AdminId } = req.session;

  try {
    if (typeof AdminId === "undefined") {
      return resp(res, 401, { msg: "권한이 없습니다" });
    }
    if (!type || !fullType || !tag || !content) {
      return resp(res, 400, { msg: "필수 항목을 채워 주세요" });
    }
    if (startDate > endDate) {
      return resp(res, 400, { msg: "등록 기간에 오류가 있습니다" });
    }
    
    const recruit = await Recruit.create({
      type,
      fullType,
      startDate,
      endDate,
      tag,
      content,
    });

    if (recruit) {
      return resp(res, 200, { msg: "생성 완료" });
    }
    return resp(res, 404, { msg: "잘못된 접근입니다" });
  } catch (e) {
    return next(e);
  }
};

const ReadRecruit = async (req, res, next) => {
  try {
  const recruits = await Recruit.findAll({});
  return resp(res, 200, recruits);
  } catch (e) {
    return next(e);
  }
};

const UpdateRecruit = async (req, res, next) => {
  const {
    type,
    fullType,
    startDate,
    endDate,
    tag,
    content,
  } = req.body;
  const { id } = req.params;

  try {
    const existRecruit = await Recruit.findOne({ where: { id } });
    if (!existRecruit) {
      return resp(res, 400, { msg: "존재하지 않는 채용공고 글 입니다" });
    }
    if (!type || !fullType || !tag || !content) {
      return resp(res, 400, { msg: "빈칸이 존재합니다" });
    }
    if (startDate > endDate) {
      return resp(res, 400, { msg: "등록 기간에 오류가 있습니다" });
    }
    
    const [updated] = await Recruit.update(
      {
        type,
        fullType,
        startDate,
        endDate,
        tag,
        content,
      }, 
      { where: { id } }
    );
    if (updated) {
      return resp(res, 200, { msg: "채용공고 수정 완료" });
    }
    return resp(res, 404, { msg: "잘못된 접근입니다" });
  } catch (e) {
    return next(e);
  }
};

const DeleteRecruit = async (req, res, next) => {
  const { id } = req.body;
  try {
    const existRecruit = await Recruit.findOne({ where: { id } });
    if (!existRecruit) {
      return resp(res, 400, { msg: "존재하지 않는 채용공고 입니다" });
    }
    const deleted = await Recruit.destroy({ where: { id } });
    if (deleted) {
      return resp(res, 200, { msg: "채용공고 삭제 완료" });
    }
    return resp(res, 404, { msg: "잘못된 접근입니다" });
  } catch (e) {
    return next(e);
  }
};

// 뉴스룸 등록
const CreateNewsRoom = async (req, res, next) => {
  const { title, content } = req.body;
  const { files } = req;
  const { AdminId } = req.session;

  try { 
    if (typeof AdminId === "undefined") {
      return resp(res, 401, { msg: "권한이 없습니다" });
    }
    if (!title || !content) {
      return resp(res, 400, { msg: "빈칸을 채워주세요" });
    }
    if (!title.length > 128) {
      return resp(res, 400, { msg: "글자수를 적당히 맞춰 주세요" });
    }

    const newsRoom = await NewsRoom.create({
      title,
      content,
    });
    
    files.map(async (file) => {
      const { originalname, filename, size } = file;
      await NewsRoomFile.create({
        originalname,
        filename: `/upload/${filename}`,
        size,
      });
    });
    if (newsRoom) {
      return resp(res, 200, { msg: "생성 완료" });
    }
    return resp(res, 404, { msg: "잘못된 접근입니다" });
  } catch (e) {
    return next(e);
  }
};

const ReadNewsRoom = async (req, res, next) => {
  try {
  const newsrooms = await NewsRoom.findAll({});
  return resp(res, 200, newsrooms);
  } catch (e) {
    return next(e);
  }
};

const UpdateNewsRoom = async (req, res, next) => {
  const { title, content } = req.body;
  const { id } = req.params;
  const { files } = req;
  const { AdminId } = req.session;

  try {
    if (typeof AdminId === "undefined") {
      return resp(res, 401, { msg: "권한이 없습니다" });
    }

    const existNewsRoom = await NewsRoom.findOne({ where: { id } });
    if (!existNewsRoom) {
      return resp(res, 403, { msg: "존재하지 않는 뉴스룸입니다" });
    }

    const prevFile = await NewsRoomFile.findAll({ where: { newsRoomId: id } });
    prevFile.forEach(async (file) => {
      await NewsRoomFile.destroy({ where: { filename: file.filename } });
    });

    if (typeof files !== "undefined") {
      files.map(async (file) => {
        const { originalname, filename, size } = file;
        await NewsRoomFile.create({
          originalname,
          filename: `/upload/${filename}`,
          size,
        });
      });
    }
    
    const [updated] = await NewsRoom.update({
      title,
      content,
    }, { where: { id } });
    if (updated) {
      return resp(res, 200, { msg: "업데이트 완료" });
    }
    return resp(res, 404, { msg: "잘못된 접근입니다" });
  } catch (e) {
    return next(e);
  }
};

const DeleteNewsRoom = async (req, res, next) => {
  const { id } = req.params;
  
  try {
    const existNewsRoom = await NewsRoom.findOne({ where: { id } });
    if (!existNewsRoom) {
      return resp(res, 400, { msg: "존재하지 않는 뉴스룸입니다" });
    }
    const deleted = await NewsRoom.destroy({ where: { id } });
    if (deleted) {
      return resp(res, 200, { msg: "삭제 완료" });
    }
    return resp(res, 404, { msg: "잘못된 접근입니다" });
  } catch (e) {
    return next(e);
  }
};

// 협력사 기능 (CRD)
const CreateClientImage = async (req, res, next) => {
  const { originalname, filename, size } = req.file;
  const { AdminId } = req.session;
  try {
    if (typeof AdminId === "undefined") {
      return resp(res, 401, { msg: "권한이 없습니다" });
    }
    const [created] = await ClientImage.create({
      originalname: originalname,
      filename: `/upload/${filename}`,
      size,
    });
    if (created) {
      return resp(res, 200, { msg: "협력사 이미지 등록 완료" });
    }
    return resp(res, 404, { msg: "잘못된 접근입니다" });
  } catch (e) {
    return next(e);
  }
};


module.exports = {
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
}