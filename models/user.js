module.exports = (queryInterface, Sequelize) => {
  const user = queryInterface.define(
    "user",
    {
      AdminId: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(256),
        allowNull: false,
      },
    },
    {
      paranoid: true,
    }
  );
  user.associate = (models) => {
  };

  return user;
}