const {Model, UUIDV4, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    class CouponUsage extends Model {}

    CouponUsage.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4, 
            primaryKey: true, 
            allowNull: false
        },
        couponId: {
            type: DataTypes.UUID, 
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        orderId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        usedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, 
    {
        sequelize, 
        underscored: false,
        timestamps: false,
        modelName: 'CouponUsage',
        tableName: 'coupon_usages'
    })

    return CouponUsage
}