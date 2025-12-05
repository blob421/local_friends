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

        UserId: {
          type: Sequelize.INTEGER,
          references: { model: "Users", key: "id" },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        BadgeId: {
          type: Sequelize.INTEGER,
          references: { model: "Badges", key: "id" },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },

    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("UserBadges");
  },
};

