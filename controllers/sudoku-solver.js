const solve = require("@mattflow/sudoku-solver");

class SudokuSolver {
  constructor(grid = 9) {
    this.grid = grid;
    this.gridLetters = {}; // e.g. {a: 0, b:1 ...}
    for (
      let row = 0, letter = "a";
      row < this.grid;
      row++, letter = String.fromCharCode(letter.charCodeAt(0) + 1)
    ) {
      this.gridLetters[letter] = row;
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
      if (grid[r][column] === value) return true;
    }
    return false;
  }
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

  checkPlacement(puzzleString, coordinate, value) {
    let puzzleGrid = this.convertToGrid(puzzleString);

    const rowLetter = coordinate.match(/\D/)[0];
    const row = this.gridLetters[rowLetter.toLowerCase()];
    const col = coordinate.match(/\d/)[0] - 1;

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

  solve(puzzleString) {
    const puzzle = puzzleString.replace(/[.]/g, 0);
    const solution = solve(puzzle);
    return solution;
  }
}

module.exports = SudokuSolver;
