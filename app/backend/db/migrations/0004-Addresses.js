module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Addresses", {
      id: {
        type: Sequelize.INTEGER,

        allowNull: false,

        primaryKey: true,

        autoIncrement: true,
      },

      street: {
        type: Sequelize.STRING,
      },

      number: {
        type: Sequelize.STRING,

        allowNull: true,
      },

      unit: {
        type: Sequelize.STRING,

        allowNull: true,
      },

      city: {
        type: Sequelize.STRING,

        allowNull: true,
      },

      district: {
        type: Sequelize.STRING,

        allowNull: true,
      },

      region: {
        type: Sequelize.STRING,

        allowNull: true,
      },

      latitude: {
        type: Sequelize.FLOAT,
      },

      longitude: {
        type: Sequelize.FLOAT,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Addresses");
  },
};

