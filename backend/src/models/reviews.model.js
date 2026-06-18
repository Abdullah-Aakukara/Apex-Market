const {Model, DataTypes, UUIDV4} = require('sequelize');

module.exports = (sequelize) => {
    class Reviews extends Model {}

    Reviews.init({
        id: {
            type: DataTypes.UUID, 
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        product_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false, 
        validate: {
            min: 1, 
            max: 5
        }
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, 
    {
        sequelize, 
      modelName: 'Reviews',
      tableName: 'reviews'
    });

    return Reviews
}