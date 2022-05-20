const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

const { puzzlesAndSolutions } = require("../controllers/puzzle-strings.js");
const validPuzzleString = puzzlesAndSolutions[0][0];
const puzzleSolution = puzzlesAndSolutions[0][1];
const withInvalidCharacters = validPuzzleString.replace(/[.]/g, "a");
const withInvalidLength = validPuzzleString + "3";
const unsolvablePuzzle = validPuzzleString.replace(/[3]/g, 6);

suite("Functional Tests", function () {
  this.timeout(5000);

  suite("Solve puzzle", () => {
    test("Solve a puzzle with valid puzzle string", (done) => {
      const payload = { puzzle: validPuzzleString };
      chai
        .request(server)
        .post("/api/solve")
        .send(payload)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.solution, puzzleSolution);
          done();
        });
    });
    test("Solve a puzzle with missing puzzle string", (done) => {
      const payload = { puzzleString: validPuzzleString }; // Wrong name
      chai
        .request(server)
        .post("/api/solve")
        .send(payload)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "Required field missing");
          done();
        });
    });
    test("Solve a puzzle with invalid characters", (done) => {
      const payload = { puzzle: withInvalidCharacters };
      chai
        .request(server)
        .post("/api/solve")
        .send(payload)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });
    test("Solve a puzzle with incorrect length", (done) => {
      const payload = { puzzle: withInvalidLength };
      chai
        .request(server)
        .post("/api/solve")
        .send(payload)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });
    test("Solve a puzzle that cannot be solved", (done) => {
      const payload = { puzzle: unsolvablePuzzle };
      chai
        .request(server)
        .post("/api/solve")
        .send(payload)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "Puzzle cannot be solved");
          done();
        });
    });
  });
  suite("Check placement", () => {
    suite("Valid placements", () => {
      test("Check a puzzle placement with all fields (and no conflicts)", (done) => {
        const payload = {
          puzzle: validPuzzleString,
          coordinate: "B2",
          value: "4",
        };
        chai
          .request(server)
          .post("/api/check")
          .send(payload)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.isTrue(res.body.valid);
            assert.isUndefined(res.body.conflict);
            done();
          });
      });
      test("Check a puzzle placement with single placement conflict", (done) => {
        const payload = {
          puzzle: validPuzzleString,
          coordinate: "B2",
          value: "3",
        };
        chai
          .request(server)
          .post("/api/check")
          .send(payload)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body.conflict.length, 1);
            done();
          });
      });
      test("Check a puzzle placement with multiple placement conflict", (done) => {
        const payload = {
          puzzle: validPuzzleString,
          coordinate: "A5",
          value: "5",
        };
        chai
          .request(server)
          .post("/api/check")
          .send(payload)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.isAtLeast(res.body.conflict.length, 2);
            done();
          });
      });
      test("Check a puzzle placement with all placement conflicts", (done) => {
        const payload = {
          puzzle: validPuzzleString,
          coordinate: "A5",
          value: "5",
        };
        chai
          .request(server)
          .post("/api/check")
          .send(payload)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body.conflict.length, 3);
            done();
          });
      });
    }); // End valid placements

    suite("Invalid placements", () => {
      test("Check a puzzle placement with missing required fields", (done) => {
        const payload = {
          puzzle: validPuzzleString, // no coordinate
          coordinate: "",
          value: "6",
        };
        chai
          .request(server)
          .post("/api/check")
          .send(payload)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body.error, "Required field(s) missing");
            done();
          });
      });
      test("Check a puzzle placement with invalid characters", (done) => {
        const payload = {
          puzzle: withInvalidCharacters,
          coordinate: "A2",
          value: "6",
        };
        chai
          .request(server)
          .post("/api/check")
          .send(payload)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body.error, "Invalid characters in puzzle");
            done();
          });
      });
      test("Check a puzzle placement with incorrect length", (done) => {
        const payload = {
          puzzle: withInvalidLength,
          coordinate: "A2",
          value: "6",
        };
        chai
          .request(server)
          .post("/api/check")
          .send(payload)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(
              res.body.error,
              "Expected puzzle to be 81 characters long"
            );
            done();
          });
      });
      test("Check a puzzle placement with invalid placement coordinate", (done) => {
        const payload = {
          puzzle: validPuzzleString,
          coordinate: "Z9", // Invalid coordinate
          value: "6",
        };
        chai
          .request(server)
          .post("/api/check")
          .send(payload)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body.error, "Invalid coordinate");
            done();
          });
      });
      test("Check a puzzle placement with invalid placement value", (done) => {
        const payload = {
          puzzle: validPuzzleString,
          coordinate: "A2", // Invalid coordinate
          value: "0",
        };
        chai
          .request(server)
          .post("/api/check")
          .send(payload)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body.error, "Invalid value");
            done();
          });
      });
    }); // End invalid placements
  });
});
