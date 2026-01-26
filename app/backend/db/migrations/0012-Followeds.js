module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Followeds", {
      id: {
        type: Sequelize.INTEGER,

        allowNull: false,

        primaryKey: true,

        autoIncrement: true,
      },

      followerId: {
        type: Sequelize.INTEGER,

        allowNull: false,

        references: {
          model: "Users",
          key: "id",
          
        },
        onDelete: "CASCADE"

      },

      followingId: {
        type: Sequelize.INTEGER,

        allowNull: false,

        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE"

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
    await queryInterface.dropTable("Followeds");
  },
};

