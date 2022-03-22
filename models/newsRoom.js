module.exports = (queryInterface, Sequelize) => {
  const newsRoom = queryInterface.define(
    "newsRoom",
    {
      title: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      }, 
    },
    {
      paranoid: true,
    }
  );
  newsRoom.associate = (models) => {
    newsRoom.hasMany(models.newsRoomFile, {
      foreignKey: "newsRoomId",
      sourceKey: "id",
    });
  };
  return newsRoom;
}