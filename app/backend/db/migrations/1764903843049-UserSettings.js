module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("UserSettings", {
      id: {
        type: Sequelize.INTEGER,

        allowNull: false,

        primaryKey: true,

        autoIncrement: true,
      },

      showEmail: {
        type: Sequelize.BOOLEAN,

        defaultValue: false,
      },

      postScopeRegion: {
        type: Sequelize.BOOLEAN,

        defaultValue: true,
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: { model: "User", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
      firstLogin: {
        type: Sequelize.BOOLEAN,

        defaultValue: true,
      },

    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("UserSettings");
  },
};

