const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('database_name', 'username', 'password', {
    host: '127.0.0.1',
    dialect: 'mysql'
});

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    account_creation_timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    last_login_timestamp: {
        type: DataTypes.DATE
    }
}, {
    timestamps: false
});

sequelize.sync();

module.exports = User;