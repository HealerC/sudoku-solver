const SudokuSolver = require("./sudoku-solver.js");
let solver = new SudokuSolver();

const checkPlacement = (req, res) => {
  const { puzzle, coordinate, value } = req.body;
  const validity = solver.validate(puzzle, coordinate, value);
  solver.throwValidationErrors(validity);
  if (!puzzle || !coordinate || !value) {
    throw new Error("Required field(s) missing");
  }
  const placement = solver.checkPlacement(puzzle, coordinate, value);
  res.json(placement);
};
const solveSudoku = (req, res) => {
  const puzzle = req.body.puzzle;
  if (!puzzle) {
    throw new Error("Required field missing");
  }

  const validity = solver.validate(puzzle);
  solver.throwValidationErrors(validity);

  const puzzleSolution = solver.solve(puzzle);
  res.send(puzzleSolution);
};

module.exports = {
  checkPlacement,
  solveSudoku,
};
