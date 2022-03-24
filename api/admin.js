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
      password: StringHash(password),
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
    if (user.password === StringHash(password)) {
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

// 관리자 탈퇴
const DeleteAdmin = async (req, res, next) => {
  const { id } = req.body;
  const { AdminId } = req.session;
  try {
    if (typeof AdminId === "undefined") {
      return resp(res, 401, { msg: "권한이 없습니다" });
    }
    if (!id) {
      return resp(res, 400, { msg: "탈퇴할 관리자를 선택해 주세요" });
    }
    const existUser = await User.findOne({
      where: { id },
    });
    if (!existUser) {
      return resp(res, 400, { msg: "존재하지 않는 관리자입니다"});
    }
    const deleted = await User.destroy({ where: { id } });
    if (deleted) {
      return resp(res, 200, { msg: "관리자 탈퇴 완료" });
    }
    return resp(res, 404, { msg: "잘못된 접근입니다" });
  } catch (e) {
    return next(e);
  }
}

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
  const { AdminId } = req.session;
  try {
    if (typeof AdminId === "undefined") {
      return resp(res, 401, { msg: "권한이 없습니다" });
    }
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
  const { AdminId } = req.session;

  try {
    if (typeof AdminId === "undefined") {
      return resp(res, 401, { msg: "권한이 없습니다" });
    }
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
  const { AdminId } = req.session; 
  try { 
    if (typeof AdminId === "undefined") {
      return resp(res, 401, { msg: "권한이 없습니다" });
    }
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
        newsRoomId: newsRoom.id,
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
  const { AdminId } = req.session;

  try {
  if (typeof AdminId === "undefined") {
    return resp(res, 401, { msg: "권한이 없습니다" });
  }
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
  const { AdminId } = req.session;
  
  try {
    if (typeof AdminId === "undefined") {
      return resp(res, 401, { msg: "권한이 없습니다" });
    }
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
  const { AdminId } = req.session;
  const { files } = req;
  try {
    if (typeof AdminId === "undefined") {
      return resp(res, 401, { msg: "권한이 없습니다" });
    }
    
    const clientImage = files.map(async (file) => {
      const { originalname, filename, size } = file;
       await ClientImage.create({
        originalname,
        filename: `/upload/${filename}`,
        size,
      });
    });
    if (clientImage) {
      return resp(res, 200, { msg: "협력사 이미지 생성 완료" });
    }
    return resp(res, 404, { msg: "잘못된 접근입니다" });
  } catch (e) {
    return next(e);
  }
};

const ReadClientImage = async (req, res, next) => {
  const { AdminId } = req.session;
  try {
    if (typeof AdminId === "undefined") {
      return resp(res, 401, { msg: "권한이 없습니다" });
    }
    const clientImages = await ClientImage.findAll({});
    return resp(res, 200, clientImages);
  } catch (e) {
    return next(e);
  }
};

const DeleteClientImage = async (req, res, next) => {
  const { AdminId } = req.session;
  const { id } = req.body;
  try {
    if (typeof AdminId === "undefined") {
      return resp(res, 401, { msg: "권한이 없습니다" });
    }
    if (!id) {
      return resp(res, 400, { msg: "삭제할 협력사를 선택해 주세요" });
    }
    const existClientImage = await ClientImage.findOne({
      where: { id },
    });
    if (!existClientImage) {
      return resp(res, 400, { msg: "존재하지 않는 협력사 이미지입니다" });
    }
    const deleted = await ClientImage.destroy({ where: { id } });
    if (deleted) {
      return resp(res, 200, { msg : "협력사 이미지 삭제 완료" });
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
  DeleteAdmin,
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
}