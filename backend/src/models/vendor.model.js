const { Model, DataTypes, UUIDV4 } = require('sequelize');

module.exports = (sequelize) => {
  class Vendor extends Model {}

  Vendor.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      storeName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      storeAddress: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
      },
    },
    {
      sequelize,
      modelName: 'Vendor',
      tableName: 'vendors',
    }
  );

  return Vendor;
};