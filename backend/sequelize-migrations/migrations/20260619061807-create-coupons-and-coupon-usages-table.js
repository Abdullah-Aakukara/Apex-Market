'use strict';

// set coupon expiry date
const couponExpiryDate = new Date();
couponExpiryDate.setDate(couponExpiryDate.getDate() + 191);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    // coupons table
    await queryInterface.createTable('coupons', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false, 
        primaryKey: true
      },
      code: {
        type: Sequelize.TEXT,
        allowNull: false, 
        unique: true
      },
      type: {
        type: Sequelize.TEXT,
        allowNull: false
      }, 
      value: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      minOrderAmount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 500
      },
      maxDiscount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 100
      },
      usageLimit: {
        type: Sequelize.INTEGER,
        allowNull: false, 
        defaultValue: 1000
      },
      usedCount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false, 
        defaultValue: () => couponExpiryDate
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false, 
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE, 
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE, 
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // coupons_usage table
    await queryInterface.createTable('coupon_usages', {
      id: {
        type: Sequelize.UUID,
        allowNull: false, 
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      }, 
      couponId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'coupons',
          key: 'id',
        }
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      orderId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id'
        }
      },
      usedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })

    // Make userId and couponId of coupon_usages composite unique
    await queryInterface.addIndex('coupon_usages', ['userId', 'couponId'], {
      unique: true,
      name: 'single-use-of-coupon'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('coupon_usages');
    await queryInterface.dropTable('coupons');
  }
};
