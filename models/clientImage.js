module.exports = (queryInterface, Sequelize) => {
  const clientImage = queryInterface.define(
    "clientImage",
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
  return clientImage;
}