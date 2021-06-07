const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');

let solver;

const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

let puzzles = puzzlesAndSolutions.map(puzzle => {
  return Object.fromEntries([['puzzle', puzzle[0]], ['solution', puzzle[1]]])
});

suite('UnitTests', () => {
  solver = new Solver();

  // Logic handles a valid puzzle string of 81 characters
  test('validates 81 characaters', (done) => {
    let validation = solver.validate(puzzles[0].puzzle);
    assert.isString(validation, 'validation should return the string' );
    assert.equal(validation, puzzles[0].puzzle, 'validation should return the same string sent' );
    done();
  });


  // Logic handles a puzzle string with invalid characters (not 1-9 or .)
  test('invalid characters in puzzle', (done) => {
    let validation = solver.validate(puzzles[5].puzzle);
    assert.isObject(validation, 'validation should return an object');
    assert.property(validation, 'error', 'validation should have an error');
    assert.equal(validation.error, 'Invalid characters in puzzle', 'error should be - Invalid characters in puzzle');
    done();
  });
  
  // Logic handles a puzzle string that is not 81 characters in length
  test('invalid character length', (done) => {
    let longPuzzle = puzzles[1].puzzle + '.';
    let validation = solver.validate(longPuzzle);
    assert.isObject(validation, 'validation should return an object');
    assert.property(validation, 'error', 'validation should have an error');
    assert.equal(validation.error, 'Expected puzzle to be 81 characters long', 'error should be - Expected puzzle to be 81 characters long');
    done();
  });
  
  // Logic handles a valid row placement
  test('validate row placement', (done) => {
    let puzzleGrid = solver.setGrid(puzzles[2].puzzle);
    let val = puzzles[2].solution[0];
    let validation = solver.checkRowPlacement(puzzleGrid, 'A', 1, val);
    assert.isBoolean(validation, 'validation should return a boolean');
    assert.equal(validation, true, 'validation should come out true');
    done();
  });
  
  // Logic handles an invalid row placement
  test('invalid row placement', (done) => {
    let puzzleGrid = solver.setGrid(puzzles[2].puzzle);
    let val = 8;
    let validation = solver.checkRowPlacement(puzzleGrid, 'A', 1, val);
    assert.isBoolean(validation, 'validation should return a boolean');
    assert.equal(validation, false, 'validation should come out false');    
    done();
  });

  // Logic handles a valid column placement
  test('validate column placement', (done) => {
    let puzzleGrid = solver.setGrid(puzzles[1].puzzle);
    let val = puzzles[1].solution[2];
    let validation = solver.checkColPlacement(puzzleGrid, 'A', 3, val);
    assert.isBoolean(validation, 'validation should return a boolean');
    assert.equal(validation, true, 'validation should come out true');       
    done();
  });
  
  // Logic handles an invalid column placement
  test('invalid column placement', (done) => {
    let puzzleGrid = solver.setGrid(puzzles[1].puzzle);
    let val = 4;
    let validation = solver.checkColPlacement(puzzleGrid, 'A', 3, val);
    assert.isBoolean(validation, 'validation should return a boolean');
    assert.equal(validation, false, 'validation should come out false');  
    done();
  });
  
  // Logic handles a valid region (3x3 grid) placement
  test('validate region placement', (done) => {
    let puzzleGrid = solver.setGrid(puzzles[1].puzzle);
    let val = puzzles[1].solution[10];
    let validation = solver.checkRegionPlacement(puzzleGrid, 'B', 11, val);
    assert.isBoolean(validation, 'validation should return a boolean');
    assert.equal(validation, true, 'validation should come out true');
    done();
  });
  
  // Logic handles an invalid region (3x3 grid) placement
  test('invalid region placement', (done) => {
    let puzzleGrid = solver.setGrid(puzzles[1].puzzle);
    let val = 9;
    let validation = solver.checkRegionPlacement(puzzleGrid, 'B', 9, val);
    assert.isBoolean(validation, 'validation should return a boolean');
    assert.equal(validation, false, 'validation should come out false');  
    done();
  });
  
  // Valid puzzle strings pass the solver
  test('valid puzzle solving', (done) => {
    let puzzleGrid = solver.setGrid(puzzles[2].puzzle);
    let puzzleSolution = puzzles[2].solution;
    let solvedPuzzle = solver.solve(puzzleGrid);
    assert.isObject(solvedPuzzle, 'puzzle solver should return an object');
    assert.property(solvedPuzzle, 'solution', 'puzzle solver should have a property of solution');
    assert.equal(solvedPuzzle.solution, puzzleSolution, 'solution must be accurate' );
    done();
  });
  
  // Invalid puzzle strings fail the solver
  test('invalid puzzle', (done) => {
    let puzzleGrid = solver.setGrid(puzzles[6].puzzle);
    let validated = solver.validateGrid(puzzleGrid);
    console.log(validated);
    assert.isBoolean(validated, 'should be a boolean');
    assert.equal(validated, false, 'should be false');
    done();
  });
  
  // Solver returns the the expected solution for an incomplete puzzle  
  test('incomplete puzzle', (done) => {
    let puzzleGrid = solver.setGrid(puzzles[6].puzzle);
    let puzzleValidation = solver.validateGrid(puzzleGrid);
    assert.isBoolean(puzzleValidation, 'should be a boolean');
    assert.equal(puzzleValidation, false, 'should be false');
    done();
  });

});
