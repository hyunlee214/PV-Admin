module.exports = (queryInterface, Sequelize) => {
  const recruit = queryInterface.define(
    "recruit",                                  
    {
      type: {                                   // 분야
        type: Sequelize.INTEGER(1),
        allowNull: false,
      },
      fullType: {                               // 상세직무
        type: Sequelize.TEXT,
        allowNull: false,
      },
      startDate: {            
        type: Sequelize.DATE,
        allowNull: true,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      tag: {                                    // 설명태그
        type: Sequelize.TEXT,
        allowNull: true,
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
  recruit.associate = (models) => {

  };
  return recruit;
}