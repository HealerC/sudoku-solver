const solve = require("@mattflow/sudoku-solver");

class SudokuSolver {
  constructor(grid = 9) {
    this.grid = 9;
    this.cells = []; // the coordinates of each cell (e.g. A1, I9 etc)

    for (
      let row = 0, letter = "a";
      row < this.grid;
      row++, letter = String.fromCharCode(letter.charCodeAt(0) + 1)
    ) {
      for (let col = 1; col <= this.grid; col++) {
        let gridLetter = `${letter.toUpperCase()}${col}`;
        this.cells.push(gridLetter);
      }
    }
  }

  validate(puzzleString, coordinate, value) {
    const validity = {};

    const nonRequiredChars = /[^.0-9]/;
    const valid = !nonRequiredChars.test(puzzleString);
    validity.validCharacters = valid;

    validity.length = puzzleString.length === 81 ? true : false;

    validity.solvable = Math.random() > 0.5;

    if (coordinate !== undefined) {
      validity.isCoordinate =
        this.cells.indexOf(coordinate.toUpperCase()) >= 0 ? true : false;
    }
    if (value !== undefined) {
      validity.isValue = value >= 1 && value <= 9 ? true : false;
    }
    return validity;
  }

  throwValidationErrors(validity) {
    if (!validity.validCharacters) {
      throw new Error("Invalid characters in puzzle");
    }
    if (!validity.length) {
      throw new Error("Expected puzzle to be 81 characters long");
    }
    if (!validity.solvable) {
      throw new Error("Puzzle cannot be solved");
    }
    if (validity.isCoordinate !== undefined && !validity.isCoordinate) {
      throw new Error("Invalid coordinate");
    }
    if (validity.isValue !== undefined && !validity.isValue) {
      throw new Error("Invalid value");
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {}

  checkColPlacement(puzzleString, row, column, value) {}

  checkRegionPlacement(puzzleString, row, column, value) {}

  solve(puzzleString) {
    const puzzle = puzzleString.replace(/[.]/g, 0);
    const solution = solve(puzzle);
    return solution;
  }
}

module.exports = SudokuSolver;
