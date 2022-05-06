class SudokuSolver {

  validate(puzzleString) {
    const validity = {};
    
    const nonRequiredChars = /[^.0-9]/;
    const valid = !nonRequiredChars.test(puzzleString);
    validity.validCharacters = valid;

    validity.length = puzzleString.length === 81 ? true : false;

    validity.solvable = Math.random() > 0.5;
    return validity;
  }

  checkRowPlacement(puzzleString, row, column, value) {

  }

  checkColPlacement(puzzleString, row, column, value) {

  }

  checkRegionPlacement(puzzleString, row, column, value) {

  }

  solve(puzzleString) {
    
  }
}

module.exports = SudokuSolver;

