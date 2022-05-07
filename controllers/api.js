const SudokuSolver = require('./sudoku-solver.js');
let solver = new SudokuSolver();

const checkPlacement = (req, res) => {
  const { puzzle, coordinate, value } = req.body;
  const validity = solver.validate(puzzle, coordinate, value);
  solver.throwValidationErrors(validity);
  res.send("Check placement");
};
const solveSudoku = (req, res) => {
  const puzzle = req.body.puzzle;
  if (!puzzle) {
    throw new Error('Required field missing');
  }

  const validity = solver.validate(puzzle);
  solver.throwValidationErrors(validity);
  res.send("Solve Sudoku");
};

module.exports = {
  checkPlacement,
  solveSudoku
};