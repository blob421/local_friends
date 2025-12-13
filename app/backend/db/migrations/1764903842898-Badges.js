module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Badges", {
      id: {
        type: Sequelize.INTEGER,

        allowNull: false,

        primaryKey: true,

        autoIncrement: true,
      },

      name: {
        type: Sequelize.STRING,

        allowNull: false,
      },
      
      picture: {
        type: Sequelize.STRING,

        allowNull: false,
      },

      description: {
        type: Sequelize.STRING,

        allowNull: false,
      },

      TeamId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Teams",
          key: id
        },
       
         onDelete: "CASCADE",
         onUpdate: "CASCADE",

      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: id
        },
        onDelete: "SET "
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Badges");
  },
};

