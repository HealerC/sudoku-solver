const SudokuSolver = require('./sudoku-solver.js');
let solver = new SudokuSolver();

const checkPlacement = (req, res) => {
  res.send("Check placement");
};
const solveSudoku = (req, res) => {
  res.send("Solve Sudoku");
};

module.exports = {
  checkPlacement,
  solveSudoku
};