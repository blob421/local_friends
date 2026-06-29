module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("UserReset", {
      id: {
        type: Sequelize.INTEGER,

        allowNull: false,

        primaryKey: true,

        autoIncrement: true,
      },

       UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },      
        onDelete: "CASCADE"},

        
      requestedAt: {
        type: Sequelize.DATE,

        defaultValue: {},
      },

      code: {
        type: Sequelize.INTEGER,

        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("UserReset");
  },
};

