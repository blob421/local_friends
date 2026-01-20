module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Posts", {
      id: {
        type: Sequelize.INTEGER,

        allowNull: false,

        primaryKey: true,

        autoIncrement: true,
      },

    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Posts");
  },
};

