'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('refresh_tokens', {
      id: {
        type: Sequelize.UUID, 
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      }, 
      user_id: {
        type: Sequelize.UUID, 
        allowNull: false, 
        references: {
          model: 'users',
          key: 'id'
        }
      }, 
      token_hash: {
        type: Sequelize.TEXT, 
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false, 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      expires_at: {
        type: Sequelize.DATE, 
        allowNull: false
      }, 
      revoked: {
        type: Sequelize.BOOLEAN, 
        allowNull: false, 
        defaultValue: false
      }
    })

    await queryInterface.addIndex('refresh_tokens', ['token_hash'], {
      name: 'idx_refresh_tokens_token_hash', 
      unique: true, 
    })

    await queryInterface.addIndex('refresh_tokens', ['user_id'], {
      name: 'idx_refresh_tokens_user_id'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.describeTable('refresh_tokens');
    await queryInterface.removeIndex('refresh_tokens', 'idx_refresh_tokens_token_hash')
    await queryInterface.removeIndex('refresh_tokens', 'idx_refresh_tokens_user_id')
  }
};
