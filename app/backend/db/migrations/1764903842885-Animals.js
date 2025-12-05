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
    await queryInterface.dropTable("Animals");
  },
};

