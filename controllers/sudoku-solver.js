const solve = require("@mattflow/sudoku-solver");

class SudokuSolver {
  /* The initial plan was to make a generic sudoku solver, but I 
  got tired and just used someone else's code to solve it.
  The constructor however is to generally create a ROW_LETTER: ROW_NUMBER 
  map that will be used later to check placement of a value in the puzzle */
  constructor(grid = 9) {
    this.grid = grid;
    this.gridLetters = {}; // e.g. {a: 0, b:1 ...}

    /* For each row in the grid, map a letter starting from 'a' to 
    the row number, saving it as gridLetters in the object. In this way
    it can handle for sudoku with a different grid (e.g. 16x16) in the future */
    for (
      let row = 0, letter = "a";
      row < this.grid;
      row++, letter = String.fromCharCode(letter.charCodeAt(0) + 1)
    ) {
      this.gridLetters[letter] = row;
    }
  }

  /* Convert a puzzle string of length 81 to a 2-D array */
  convertToGrid(puzzleString) {
    let i = 0; // A number in the string
    let puzzleGrid = []; // The array of the entire puzzle
    for (let r = 0; r < this.grid; r++) {
      let rowList = []; // A row
      for (let c = 0; c < this.grid; c++) {
        rowList.push(puzzleString[i]);
        i++;
      }
      puzzleGrid.push(rowList); // A row completed
    }
    return puzzleGrid;
  }

  /* Check if there is a cell in the same row bearing the same number as value */
  checkRowPlacement(grid, row, column, value) {
    return grid[row].indexOf(value) >= 0;
  }

  /* Check if there is a cell in the same col bearing the same number as value */
  checkColPlacement(grid, row, column, value) {
    for (let r in grid) {
      if (grid[r][column] === value) return true;
    }
    return false;
  }

  /* Check if there is a cell in the same region bearing the same number as value */
  checkRegionPlacement(grid, row, column, value) {
    // Every number in the same region will get the same number
    // when divided by n(colRegion) or n(rowRegion)
    let rowCalc = Math.floor(row / 3); // Rote calculation
    let colCalc = Math.floor(column / 3); // Rote calculation

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

  /* Main man that coordinates checking of placement */
  checkPlacement(puzzleString, coordinate, value) {
    let puzzleGrid = this.convertToGrid(puzzleString);

    const rowLetter = coordinate.match(/\D/)[0];
    const row = this.gridLetters[rowLetter.toLowerCase()];
    // Get row number from object initialized in constructor
    const col = coordinate.match(/\d/)[0] - 1;
    // The user starts counting from 1

    // User checks placement of a value in its cell
    if (puzzleGrid[row][col] === value) {
      return { valid: true };
    }

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

  /* Shout out to @mattflow */
  solve(puzzleString) {
    const puzzle = puzzleString.replace(/[.]/g, 0);
    const solution = solve(puzzle);
    return solution;
  }
}

module.exports = SudokuSolver;
