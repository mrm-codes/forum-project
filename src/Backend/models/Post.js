const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Thread = require('./Thread');

const Post = sequelize.define('Post', {
  content: { type: DataTypes.TEXT, allowNull: false },
  
  userId: {
    type: DataTypes.INTEGER,
    references: { model: User, key: 'id' },
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },

  threadId: {
    type: DataTypes.INTEGER,
    references: { model: Thread, key: 'id' },
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
});

Post.belongsTo(User, { foreignKey: 'userId' });
Post.belongsTo(Thread, { foreignKey: 'threadId' });


User.hasMany(Post, { as: 'posts', foreignKey: 'userId' });
Thread.hasMany(Post, { as: 'posts', foreignKey: 'threadId' });


module.exports = Post;
