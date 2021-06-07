'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) { return res.json({ error: 'Required field(s) missing' }) };

      const row = coordinate[0].toUpperCase();
      const col = coordinate[1];

      const validatedPuzzle = solver.validate(puzzle);
      const validatedInput = solver.validateCheckInput(row, col, value);

      if (validatedPuzzle.error) {
        return res.json(validatedPuzzle);
      } else if (validatedInput.error) {
        return res.json(validatedInput);
      }

      const puzzleGrid = solver.setGrid(validatedPuzzle);

      const sameCoor = solver.checkCoordinates(puzzleGrid, row, col, value);
      const rowRes = solver.checkRowPlacement(puzzleGrid, row, col, value);
      const colRes = solver.checkColPlacement(puzzleGrid, row, col, value);
      const regionRes = solver.checkRegionPlacement(puzzleGrid, row, col, value);

      
      if ( (rowRes && colRes && regionRes) || sameCoor ) {
        return res.json({ valid: true });
      } else {
        let conflicts = [];
        if (!rowRes) { conflicts.push('row') };
        if (!colRes) { conflicts.push('column') };
        if (!regionRes) { conflicts.push('region') };
        return res.json({ "valid": false, "conflict": conflicts });
      }

    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) { return res.json({error: 'Required field missing'}) };

      const validatedPuzzle = solver.validate(puzzle);

      if (validatedPuzzle.error) {
        return res.json(validatedPuzzle);
      }

      const puzzleGrid = solver.setGrid(validatedPuzzle);

      if(!solver.validateGrid(puzzleGrid)) {
        return res.json({ error: 'Puzzle cannot be solved' });
      };

      const result = solver.solve(puzzleGrid);

      res.json(result);


    });
};
