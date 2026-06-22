const {DataTypes, Model, UUIDV4} = require('sequelize')

// set coupon expiry date
const couponExpiryDate = new Date();
couponExpiryDate.setDate(couponExpiryDate.getDate() + 191);

module.exports = (sequelize) => {
    class Coupon extends Model {}

    Coupon.init({
        id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false, 
        primaryKey: true
      },
      code: {
        type: DataTypes.TEXT,
        allowNull: false, 
        unique: true
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      }, 
      value: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      minOrderAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 500
      },
      maxDiscount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 100
      },
      usageLimit: {
        type: DataTypes.INTEGER,
        allowNull: false, 
        defaultValue: 1000
      },
      usedCount: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false, 
        defaultValue: () => couponExpiryDate
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false, 
        defaultValue: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false, 
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false, 
        defaultValue: DataTypes.NOW
      }
    },
    {
        sequelize,
        modelName: 'Coupon',
        tableName: 'coupons',
        underscored: false,
        timestamps: false
    }
    );

    return Coupon
}