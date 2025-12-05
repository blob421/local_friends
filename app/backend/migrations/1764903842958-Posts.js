module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Posts", {
      id: {
        type: Sequelize.INTEGER,

        allowNull: false,

        primaryKey: true,

        autoIncrement: true,
      },

      title: {
        type: Sequelize.STRING,

        allowNull: false,
      },

      content: {
        type: Sequelize.TEXT,

        allowNull: false,
      },

      guessed_animal: {
        type: Sequelize.STRING,
      },

      latitude: {
        type: Sequelize.FLOAT,
      },

      longitude: {
        type: Sequelize.FLOAT,
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
    await queryInterface.dropTable("Posts");
  },
};

