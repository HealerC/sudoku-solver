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

    this.gridLetters = {};
    for (
      let row = 0, letter = "a";
      row < this.grid;
      row++, letter = String.fromCharCode(letter.charCodeAt(0) + 1)
    ) {
      this.gridLetters[letter] = row;
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
  convertToGrid(puzzleString) {
    let i = 0;
    let puzzleGrid = [];
    for (let r = 0; r < this.grid; r++) {
      let rowList = [];
      for (let c = 0; c < this.grid; c++) {
        rowList.push(puzzleString[i]);
        i++;
      }
      puzzleGrid.push(rowList);
    }
    return puzzleGrid;
  }

  checkRowPlacement(grid, row, column, value) {
    return grid[row].indexOf(value) >= 0;
  }
  checkColPlacement(grid, row, column, value) {
    for (let r in grid) {
      if (grid[r][column - 1] === value) return true;
    }
    return false;
  }
  checkRegionPlacement(grid, row, column, value) {
    // Every number in the same region will get the same number
    // when divided by n(colRegion) or n(rowRegion)
    let rowCalc = Math.floor(row / 3); // Rote calculation
    let colCalc = Math.floor((column - 1) / 3); // Rote calculation

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        let rowCalcNum = Math.floor(row / 3);
        let colCalcNum = Math.floor(col / 3);
        if (colCalcNum === colCalc && rowCalcNum === rowCalc) {
          let number = grid[row][col]; // same region
          if (number === value) return true;
        }
      }
    }
    return false;
  }

  checkPlacement(puzzleString, coordinate, value) {
    let puzzleGrid = this.convertToGrid(puzzleString);

    const rowLetter = coordinate.match(/\D/)[0];
    const row = this.gridLetters[rowLetter.toLowerCase()];
    const col = coordinate.match(/\d/)[0];

    const presentInRow = this.checkRowPlacement(puzzleGrid, row, col, value);
    const presentInCol = this.checkColPlacement(puzzleGrid, row, col, value);
    const presentInReg = this.checkRegionPlacement(puzzleGrid, row, col, value);

    const conflicts = [];
    if (presentInRow) {
      conflicts.push("row");
    }
    if (presentInCol) {
      conflicts.push("column");
    }
    if (presentInReg) {
      conflicts.push("region");
    }
    return conflicts.length === 0
      ? { valid: true }
      : { valid: false, conflict: conflicts };
  }

  solve(puzzleString) {
    const puzzle = puzzleString.replace(/[.]/g, 0);
    const solution = solve(puzzle);
    return solution;
  }
}

module.exports = SudokuSolver;
