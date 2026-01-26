'use strict';

const { sequelize } = require('../../db');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable('Comment', {'id': {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    }})

    await queryInterface.createTable('SubComment', {'id': {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    }})
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Comment')
    await queryInterface.dropTable('SubComment')

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
