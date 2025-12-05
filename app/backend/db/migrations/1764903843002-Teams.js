module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Teams", {
      id: {
        type: Sequelize.INTEGER,

        allowNull: false,

        primaryKey: true,

        autoIncrement: true,
      },

      name: {
        type: Sequelize.STRING,

        allowNull: false,

        unique: true,
      },

    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Teams");
  },
};

