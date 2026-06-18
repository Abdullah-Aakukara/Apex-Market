const {Model, UUIDV4, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    class Wishlist extends Model {}

    Wishlist.init({
        id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: true
        }
    }, 
    {
        sequelize, 
        modelName: 'Wishlist',
        tableName: 'wishlist'
    })

    return Wishlist
}