const crypto = require("crypto");


exports.StringHash = (str) => {
  const hashed = crypto
    .createHash("sha256")
    .update(str + process.env.Salt)
    .digest("hex");
  return hashed;
};

exports.FileHash = (str) => {
  const ext = str.split(".")[str.split(".").length - 1];
  const hashed = crypto
    .createHash("sha256")
    .update(str + process.env.Salt + new Date().getMilliseconds())
    .digest("hex");
  return `${hashed}.${ext}`;
};

exports.AuthCodeGenerator = () =>
  crypto.randomInt(0, 999999).toString().padStart(6, "0");
