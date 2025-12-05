module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Regions", {
      id: {
        type: Sequelize.INTEGER,

        allowNull: false,

        primaryKey: true,

        autoIncrement: true,
      },

      osm_id: {
        type: Sequelize.BIGINT,
      },

      osm_type: {
        type: Sequelize.STRING,
      },

      name: {
        type: Sequelize.TEXT,
      },

      display_name: {
        type: Sequelize.STRING,
      },

      county: {
        type: Sequelize.STRING,
      },

      country: {
        type: Sequelize.STRING,
      },

      country_code: {
        type: Sequelize.STRING,
      },

      iso: {
        type: Sequelize.STRING,
      },

      state: {
        type: Sequelize.STRING,
      },

      kind: {
        type: Sequelize.STRING,
      },

      bbox: {
        type: Sequelize.ARRAY,
      },

      location: {
        type: Sequelize.ARRAY,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Regions");
  },
};

