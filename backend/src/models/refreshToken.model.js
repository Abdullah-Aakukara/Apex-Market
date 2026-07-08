const {UUID, DataTypes, Model} = require('sequelize')

module.exports = (sequelize) => {
    class RefreshToken extends Model {}

    RefreshToken.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false, 
            defaultValue: DataTypes.UUIDV4
        }, 
        user_id: {
            type: DataTypes.UUID, 
            allowNull: false
        }, 
        token_hash: {
            type: DataTypes.TEXT, 
            allowNull: false, 
            unique: true
        }, 
        revoked: {
            type: DataTypes.BOOLEAN, 
            allowNull: false, 
            defaultValue: false
        },
        created_at: {
            type: DataTypes.DATE, 
            allowNull: false, 
            defaultValue: DataTypes.NOW 
        }, 
        expires_at: {
            type: DataTypes.DATE, 
            allowNull: false, 
            defaultValue: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
    }, {
        sequelize, 
        timestamps: false,
        modelName: 'RefreshToken',
        tableName: 'refresh_tokens'
    })

    return RefreshToken;
}