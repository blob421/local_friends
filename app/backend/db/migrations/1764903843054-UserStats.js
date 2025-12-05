module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("UserStats", {
      id: {
        type: Sequelize.INTEGER,

        allowNull: false,

        primaryKey: true,

        autoIncrement: true,
      },

      found: {
        type: Sequelize.INTEGER,
      },

      createdAt: {
        type: Sequelize.DATE,

        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,

        allowNull: false,
      },
      UserId: {
      type: Sequelize.INTEGER,
      references: { model: "User", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("UserStats");
  },
};

