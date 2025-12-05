module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("UserBadges", {
      id: {
        type: Sequelize.INTEGER,

        allowNull: false,

        primaryKey: true,

        autoIncrement: true,
      },

      awardedAt: {
        type: Sequelize.DATE,

        defaultValue: {},
      },

      createdAt: {
        type: Sequelize.DATE,

        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,

        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("UserBadges");
  },
};

