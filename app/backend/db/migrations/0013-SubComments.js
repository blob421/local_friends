module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("SubComments", {
      id: {
        type: Sequelize.INTEGER,

        allowNull: false,

        primaryKey: true,

        autoIncrement: true,
      },

      content: {
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
      CommentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Comments", key: "id" }, 
        onDelete: "CASCADE",
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
         references: { model: "Users", key: "id" },      
        onDelete: "CASCADE",

      },
      ParentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {model: "SubComments", key: "id"},
        onDelete: "CASCADE",  
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("SubComments");
  },
};

