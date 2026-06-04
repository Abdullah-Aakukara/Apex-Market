const { Model, DataTypes, UUIDV4 } = require('sequelize');

module.exports = (sequelize) => {
  class Payment extends Model {}

  Payment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      provider: {
        type: DataTypes.ENUM('razorpay', 'stripe'),
        allowNull: false,
        defaultValue: 'razorpay',
      },
      transactionId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'success', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
      },
      paidAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Payment',
      tableName: 'payments',
    }
  );

  return Payment;
};