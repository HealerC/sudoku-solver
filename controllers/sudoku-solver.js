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

  throwValidationErrors(validity) {
    if (!validity.validCharacters) {
      throw new Error('Invalid characters in puzzle');
    }
    if (!validity.length) {
      throw new Error('Expected puzzle to be 81 characters long');
    }
    if (!validity.solvable) {
      throw new Error('Puzzle cannot be solved');
    }
    if (validity.coordinate !== undefined && !validity.coordinate) {
      throw new Error('Invalid coordinate');
    }
    if (validity.value !== undefined && !validity.value) {
      throw new Error('Invalid value');
    }
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

