'use strict';
module.exports = function(sequelize, DataTypes) {
  var favourite = sequelize.define('favourite', {
    countryName: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.favourite.belongsTo(models.user);
      }
    }
  });
  return favourite;
};
