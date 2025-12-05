module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Users", {
      id: {
        type: Sequelize.INTEGER,

        allowNull: false,

        primaryKey: true,

        autoIncrement: true,
      },

      firstName: {
        type: Sequelize.STRING,
      },

      lastName: {
        type: Sequelize.STRING,
      },

      email: {
        type: Sequelize.STRING,

        allowNull: false,
      },

      username: {
        type: Sequelize.STRING,

        allowNull: false,
      },

      password: {
        type: Sequelize.STRING,

        allowNull: false,
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
      TeamId: {
        type: Sequelize.INTEGER,
        references: { model: "Teams", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      RegionId: {
        type: Sequelize.INTEGER,
        references: { model: "Regions", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      AnimalId: {
        type: Sequelize.INTEGER,
        references: { model: "Animals", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },



    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Users");
  },
};

