const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();
let validate = require("../controllers/validator.js");

const { puzzlesAndSolutions } = require("../controllers/puzzle-strings.js");

const testSolver = {
  solve(puzzle) {
    validate(puzzle);
    return solver.solve(puzzle);
  },
  check(puzzle, coordinate, value) {
    validate(puzzle, coordinate, value);
    return solver.checkPlacement(puzzle, coordinate, value);
  },
};

const validPuzzleString = puzzlesAndSolutions[0][0];
const puzzleSolution = puzzlesAndSolutions[0][1];
const withInvalidCharacters = validPuzzleString.replace(/[.]/g, "a");
const withInvalidLength = validPuzzleString + "3";
const invalidPuzzleString = validPuzzleString.replace(/[3]/g, 6);

suite("UnitTests", () => {
  suite("Puzzle strings 1", function () {
    test("Logic handles a valid puzzle string of 81 characters", function () {
      assert.equal(testSolver.solve(validPuzzleString), puzzleSolution);
    });
    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function () {
      assert.throws(
        testSolver.solve.bind(testSolver, withInvalidCharacters),
        "Invalid characters in puzzle"
      );
    });
    test("Logic handles a puzzle string that is not 81 characters in length", function () {
      assert.throws(
        testSolver.solve.bind(testSolver, withInvalidLength),
        "Expected puzzle to be 81 characters long"
      );
    });
  });

  suite("Row and column placements", function () {
    suite("Valid placements", () => {
      test("Logic handles a valid row placement", function () {
        assert.notInclude(
          testSolver.check(validPuzzleString, "B1", "5").conflict,
          "row"
        );
      });
      test("Logic handles a valid column placement", function () {
        assert.notInclude(
          testSolver.check(validPuzzleString, "A4", "4").conflict,
          "column"
        );
      });
      test("Logic handles a valid region (3x3 grid) placement", function () {
        assert.notInclude(
          testSolver.check(validPuzzleString, "D3", "1").conflict,
          "region"
        );
      });
    });
    suite("Invalid placements", () => {
      test("Logic handles an invalid row placement", function () {
        assert.include(
          testSolver.check(validPuzzleString, "A4", "2").conflict,
          "row"
        );
      });
      test("Logic handles an invalid column placement", function () {
        assert.include(
          testSolver.check(validPuzzleString, "H5", "4").conflict,
          "column"
        );
      });
      test("Logic handles a valid region (3x3 grid) placement", function () {
        assert.include(
          testSolver.check(validPuzzleString, "F6", "3").conflict,
          "region"
        );
      });
    });
  });

  suite("Puzzle strings 2", function () {
    test("Valid puzzle strings pass the solver", function () {
      assert.doesNotThrow(
        testSolver.solve.bind(testSolver, validPuzzleString),
        "Puzzle could not be solved"
      );
    });
    test("Invalid puzzle strings fail the solver", function () {
      assert.throws(
        testSolver.solve.bind(testSolver, invalidPuzzleString),
        "Puzzle could not be solved"
      );
    });
    test("Solver returns the expected solution for an incomplete puzzle", function () {
      assert.equal(testSolver.solve(validPuzzleString), puzzleSolution);
    });
  });
});
