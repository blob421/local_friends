module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Media", {
      id: {
        type: Sequelize.INTEGER,

        allowNull: false,

        primaryKey: true,

        autoIncrement: true,
      },

      filename: {
        type: Sequelize.STRING,

        allowNull: false,
      },

      url: {
        type: Sequelize.STRING,

        allowNull: false,
      },

      mimeType: {
        type: Sequelize.STRING,

        allowNull: false,
      },

      createdAt: {
        type: Sequelize.DATE,

        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,

        allowNull: false,
      },
       PostId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Posts",
          key: id
        },
       
         onDelete: "CASCADE",

      },
       UserId: {
    type: Sequelize.INTEGER,
    references: { model: "User", key: "id" },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },

      
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Media");
  },
};

