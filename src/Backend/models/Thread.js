const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Category = require('./Category');

const Thread = sequelize.define('Thread', {
  title: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },

  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    references: { 
      model: User, 
      key: 'id', },

    onUpdate: 'CASCADE', 
    onDelete: 'CASCADE' },

    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: Category,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
     },
}); 

Thread.belongsTo(User, {foreignKey: 'userId'});
User.hasMany(Thread, { foreignKey: 'userId' })

Thread.belongsTo(Category, {foreignKey: 'categoryId'});
Category.hasMany(Thread, { foreignKey: 'categoryId' });


module.exports = Thread;
