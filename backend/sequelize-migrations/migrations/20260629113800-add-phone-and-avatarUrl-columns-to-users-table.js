'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {  
    // phone column
    await queryInterface.addColumn('users', 'phone', {
      type: Sequelize.TEXT, 
      allowNull: false,
      defaultValue: 1234567890 
    });
    
    // avatar url column 
    await queryInterface.addColumn('users', 'avatar_url', {
      type: Sequelize.TEXT, 
      allowNull: false,
      defaultValue: 'NA'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'phone');

    await queryInterface.removeColumn('users', 'avatar_url')
  }
};
