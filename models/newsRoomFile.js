module.exports = (queryInterface, Sequelize) => {
  const newsRoomFile = queryInterface.define(
    "newsRoomFile",
    {
      originalname: {
        type: Sequelize.STRING(256),
        allowNull: false,
      },
      filename: {
        type: Sequelize.STRING(80),
        allowNull: false,
      },
      size: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      paranoid: true,
    }
  );
  newsRoomFile.associate = (models) => {
    newsRoomFile.belongsTo(models.newsRoom, {
      foreignKey: "newsRoomId",
      sourceKey: "id",
    });
  };
  return newsRoomFile;
}