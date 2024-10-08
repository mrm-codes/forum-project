const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Thread = sequelize.define('Thread', {
  title: { type: DataTypes.STRING, allowNull: false }
});

module.exports = Thread;
