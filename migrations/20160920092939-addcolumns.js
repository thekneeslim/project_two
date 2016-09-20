'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.addColumn(
        'users',
        'gender',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'users',
        'age',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'users',
        'country',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      )
    ];
  },

  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('users', 'gender'),
      queryInterface.removeColumn('users', 'age'),
      queryInterface.removeColumn('users', 'country')
    ];
  }
};
