/* Handles validation for both solve puzzle and check placement */
const validate = (puzzleString, coordinate, value, grid = 9) => {
  let cells = []; // the coordinates of each cell (e.g. A1, I9 etc)

  /* Push all coordinates of a given grid into an array e.g. ["A1", "A2", "A3" ... "I9"] */
  for (
    let row = 0, letter = "a";
    row < grid;
    row++, letter = String.fromCharCode(letter.charCodeAt(0) + 1)
  ) {
    for (let col = 1; col <= grid; col++) {
      let gridLetter = `${letter.toUpperCase()}${col}`;
      cells.push(gridLetter);
    }
  }

  const nonRequiredChars = /[^.0-9]/;
  const hasInvalidChars = nonRequiredChars.test(puzzleString);
  if (hasInvalidChars) {
    throw new Error("Invalid characters in puzzle");
  }

  if (puzzleString.length !== 81) {
    throw new Error("Expected puzzle to be 81 characters long");
  }

  if (coordinate !== undefined) {
    // For check placement
    if (cells.indexOf(coordinate.toUpperCase()) < 0) {
      throw new Error("Invalid coordinate");
    }
  }
  if (value !== undefined) {
    // For check placement
    if (!(value >= 1 && value <= 9)) {
      throw new Error("Invalid value");
    }
  }
};
module.exports = validate;
