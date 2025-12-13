module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("UserStats", {
      id: {
        type: Sequelize.INTEGER,

        allowNull: false,

        primaryKey: true,

        autoIncrement: true,
      },

      found: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      followers: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      following: {
        type: DataTypes.INTEGER,
        defaultValue: 0

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
      references: { model: "User", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("UserStats");
  },
};

