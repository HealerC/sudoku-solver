const SudokuSolver = require('./sudoku-solver.js');
let solver = new SudokuSolver();

const checkPlacement = (req, res) => {
  res.send("Check placement");
};
const solveSudoku = (req, res) => {
  const puzzle = req.body.puzzle;
  if (!puzzle) {
    throw new Error('Required field missing');
  }

  const validity = solver.validate(puzzle);
  if (!validity.validCharacters) {
    throw new Error('Invalid characters in puzzle');
  }
  if (!validity.length) {
    throw new Error('Expected puzzle to be 81 characters long');
  }
  if (!validity.solvable) {
    throw new Error('Puzzle cannot be solved');
  }
  res.send("Solve Sudoku");
};

module.exports = {
  checkPlacement,
  solveSudoku
};