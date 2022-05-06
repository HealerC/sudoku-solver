'use strict';
const { checkPlacement, solveSudoku } = require('../controllers/api.js');

module.exports = function (app) {

  app.route('/api/check')
    .post(checkPlacement);
    
  app.route('/api/solve')
    .post(solveSudoku);
};
