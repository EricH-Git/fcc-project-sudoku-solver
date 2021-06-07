const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

let puzzles = puzzlesAndSolutions.map(puzzle => {
  return Object.fromEntries([['puzzle', puzzle[0]], ['solution', puzzle[1]]])
});

chai.use(chaiHttp);

suite('Functional Tests', () => {

  // Solve a puzzle with valid puzzle string: POST request to /api/solve
  test('POST valid puzzle', (done) => {
    chai.request(server)
      .post('/api/solve')
      .type('form')
      .send({ puzzle: puzzles[1].puzzle })
      .end((err, res) => {
        if (err) { console.log(err) }
        assert.equal(res.status, 200, 'response should be 200');
        assert.isObject(res.body, 'response should be an object');
        assert.property(res.body, 'solution', 'response should have a solution');
        assert.equal(res.body.solution, puzzles[1].solution, 'puzzle solutions should be equal to stored solution');
        done();
      })
  });
  
  // Solve a puzzle with missing puzzle string: POST request to /api/solve
  test('POST with missing puzzle string', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send()
      .end((err, res) => {
        if (err) { console.log(err) }
        assert.equal(res.status, 200, 'response should be 200');
        assert.isObject(res.body, 'response should be an object');
        assert.property(res.body, 'error', 'response should be an error');
        assert.equal(res.body.error, 'Required field missing', 'error should be the correct error');
        done();
      })
  });

  // Solve a puzzle with invalid characters: POST request to /api/solve
  test('POST with invalid characters', (done) => {
    chai.request(server)
      .post('/api/solve')
      .type('form')
      .send({ puzzle: puzzles[5].puzzle })
      .end((err, res) => {
        if (err) { console.log(err) }
        assert.equal(res.status, 200, 'response should be 200');
        assert.isObject(res.body, 'response should be an object');
        assert.property(res.body, 'error', 'response should be an error');
        assert.equal(res.body.error, 'Invalid characters in puzzle', 'error should be the correct error');
        done();
      })
  });

  // Solve a puzzle with incorrect length: POST request to /api/solve
  test('POST with incorrect length', (done) => {
    chai.request(server)
      .post('/api/solve')
      .type('form')
      .send({ puzzle: '..5..23.........' })
      .end((err, res) => {
        if (err) { console.log(err) }
        assert.equal(res.status, 200, 'response should be 200');
        assert.isObject(res.body, 'response should be an object');
        assert.property(res.body, 'error', 'response should be an error');
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long', 'error should be the correct error');
        done();
      })
  });

  // Solve a puzzle that cannot be solved: POST request to /api/solve
  test('POST that cannot be solved', (done) => {
    chai.request(server)
      .post('/api/solve')
      .type('form')
      .send({ puzzle: puzzles[6].puzzle })
      .end((err, res) => {
        if (err) { console.log(err) }
        assert.equal(res.status, 200, 'response should be 200');
        assert.isObject(res.body, 'response should be an object');
        assert.property(res.body, 'error', 'response should be an error');
        assert.equal(res.body.error, 'Puzzle cannot be solved', 'error should be the correct error');
        done();
      })
  });

  // Check a puzzle placement with all fields: POST request to /api/check
  test('POST with all fields', (done) => {
    chai.request(server)
      .post('/api/check')
      .type('form')
      .send({ puzzle: puzzles[0].puzzle, coordinate: 'A4', value: puzzles[0].solution[3] })
      .end((err, res) => {
        if (err) { console.log(err) }
        assert.equal(res.status, 200, 'response should be 200');
        assert.isObject(res.body, 'response should be an object');
        assert.property(res.body, 'valid', 'response should have a valid feild');
        assert.equal(res.body.valid, true, 'valid should be true');
        done();
      })
  });

  // Check a puzzle placement with single placement conflict: POST request to /api/check
  test('POST with single placement conflict', (done) => {
    chai.request(server)
      .post('/api/check')
      .type('form')
      .send({ puzzle: puzzles[1].puzzle, coordinate: 'A3', value: 4 })
      .end((err, res) => {
        if (err) { console.log(err) }
        assert.equal(res.status, 200, 'response should be 200');
        assert.isObject(res.body, 'response should be an object');
        assert.property(res.body, 'valid', 'response should have a valid feild');
        assert.property(res.body, 'conflict', 'response should have a conflict feild');
        assert.equal(res.body.valid, false, 'valid should be false');
        assert.isArray(res.body.conflict, 'conflict should be an array');
        assert.lengthOf(res.body.conflict, 1 , 'conflict should be of 1');
        done();
      })
  });

  // Check a puzzle placement with multiple placement conflicts: POST request to /api/check
  test('POST with multiple placement conflicts', (done) => {
    chai.request(server)
      .post('/api/check')
      .type('form')
      .send({ puzzle: puzzles[1].puzzle, coordinate: 'A3', value: 3 })
      .end((err, res) => {
        if (err) { console.log(err) }
        assert.equal(res.status, 200, 'response should be 200');
        assert.isObject(res.body, 'response should be an object');
        assert.property(res.body, 'valid', 'response should have a valid feild');
        assert.property(res.body, 'conflict', 'response should have a conflict feild');
        assert.equal(res.body.valid, false, 'valid should be false');
        assert.isArray(res.body.conflict, 'conflict should be an array');
        assert.lengthOf(res.body.conflict, 2 , 'conflict should be of 2');
        done();
      })
  });

  // Check a puzzle placement with all placement conflicts: POST request to /api/check
  test('POST with all placement conflicts', (done) => {
    chai.request(server)
      .post('/api/check')
      .type('form')
      .send({ puzzle: puzzles[1].puzzle, coordinate: 'A3', value: 9 })
      .end((err, res) => {
        if (err) { console.log(err) }
        assert.equal(res.status, 200, 'response should be 200');
        assert.isObject(res.body, 'response should be an object');
        assert.property(res.body, 'valid', 'response should have a valid feild');
        assert.property(res.body, 'conflict', 'response should have a conflict feild');
        assert.equal(res.body.valid, false, 'valid should be false');
        assert.isArray(res.body.conflict, 'conflict should be an array');
        assert.lengthOf(res.body.conflict, 3 , 'conflict should be of 3');
        done();
      })
  });

  // Check a puzzle placement with missing required fields: POST request to /api/check
  test('POST with missing required fields', (done) => {
    chai.request(server)
      .post('/api/check')
      .type('form')
      .send({ value: 5 })
      .end((err, res) => {
        if (err) { console.log(err) }
        assert.equal(res.status, 200, 'response should be 200');
        assert.isObject(res.body, 'response should be an object');
        assert.property(res.body, 'error', 'response should be an error');
        assert.equal(res.body.error, 'Required field(s) missing', 'error should be the correct error');
        done();
      })
  });

  // Check a puzzle placement with invalid characters: POST request to /api/check
  test('POST with invalid characters', (done) => {
    chai.request(server)
      .post('/api/check')
      .type('form')
      .send({ puzzle: puzzles[5].puzzle, coordinate: 'A3', value: 9 })
      .end((err, res) => {
        if (err) { console.log(err) }
        assert.equal(res.status, 200, 'response should be 200');
        assert.isObject(res.body, 'response should be an object');
        assert.property(res.body, 'error', 'response should be an error');
        assert.equal(res.body.error, 'Invalid characters in puzzle', 'error should be the correct error');
        done();
      })
  });

  // Check a puzzle placement with incorrect length: POST request to /api/check
  test('POST with incorrect length', (done) => {
    chai.request(server)
      .post('/api/check')
      .type('form')
      .send({ puzzle: '...4....5', coordinate: 'A3', value: 9 })
      .end((err, res) => {
        if (err) { console.log(err) }
        assert.equal(res.status, 200, 'response should be 200');
        assert.isObject(res.body, 'response should be an object');
        assert.property(res.body, 'error', 'response should be an error');
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long', 'error should be the correct error');
        done();
      })
  });

  // Check a puzzle placement with invalid placement coordinate: POST request to /api/check
  test('POST with invalid placement coordinate', (done) => {
    chai.request(server)
      .post('/api/check')
      .type('form')
      .send({ puzzle: puzzles[0].puzzle, coordinate: 'Z5', value: puzzles[0].solution[3] })
      .end((err, res) => {
        if (err) { console.log(err) }
        assert.equal(res.status, 200, 'response should be 200');
        assert.isObject(res.body, 'response should be an object');
        assert.property(res.body, 'error', 'response should be an error');
        assert.equal(res.body.error, 'Invalid coordinate', 'error should be the correct error');
        done();
      })
  });

  // Check a puzzle placement with invalid placement value: POST request to /api/check
  test('POST with invalid placement value', (done) => {
    chai.request(server)
      .post('/api/check')
      .type('form')
      .send({ puzzle: puzzles[0].puzzle, coordinate: 'A2', value: 'Z' })
      .end((err, res) => {
        if (err) { console.log(err) }
        assert.equal(res.status, 200, 'response should be 200');
        assert.isObject(res.body, 'response should be an object');
        assert.property(res.body, 'error', 'response should be an error');
        assert.equal(res.body.error, 'Invalid value', 'error should be the correct error');
        done();
      })
  });


});

