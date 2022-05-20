const SudokuSolver = require("./sudoku-solver.js"); // Solves puzzles and checks placement
const validate = require("./validator.js"); // Validate the arguments provided
let solver = new SudokuSolver();

const checkPlacement = (req, res) => {
  const { puzzle, coordinate, value } = req.body;

  if (!puzzle || !coordinate || !value) {
    throw new Error("Required field(s) missing");
  }
  validate(puzzle, coordinate, value); // Throws Error on invalid argument

  const placement = solver.checkPlacement(puzzle, coordinate, value);
  res.json(placement);
};
const solveSudoku = (req, res) => {
  const puzzle = req.body.puzzle;

  if (!puzzle) {
    throw new Error("Required field missing");
  }
  validate(puzzle);

  const puzzleSolution = solver.solve(puzzle);
  res.json({ solution: puzzleSolution });
};

module.exports = {
  checkPlacement,
  solveSudoku,
};
