module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Animals", {
      id: {
        type: Sequelize.INTEGER,

        allowNull: false,

        primaryKey: true,

        autoIncrement: true,
      },

      name: {
        type: Sequelize.STRING,
      },

      description: {
        type: Sequelize.TEXT,
      },

      picture: {
        type: Sequelize.STRING,
      },

    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Animals");
  },
};

