module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Comments", {
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
       UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: id
        },
       
         onDelete: "CASCADE",
         onUpdate: "CASCADE",


      },
       PostId: {
        type: Sequelize.INTEGER,
        references: { model: 'Posts', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Comments");
  },
};

