const rowNum = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

class SudokuSolver {

  setGrid(puzzleString) {
    let grid = [];
    for (let i = 0; i < 9; i++) {
      let row = [];
      for (let c = (0+(i*9)); c < (9+(i*9)); c++) {
        row.push(puzzleString[c]);
      }
      grid.push(row);
    }
    return grid;
  }

  checkForEmpty(puzzleGrid) {
    for (let i = 0; i < 9; i++) {
        for (let o = 0; o < 9; o++) {
            if (puzzleGrid[i][o] === '.') 
                return [i, o];
        }
    }
    return [-1, -1];
  }

  checkForFailed(puzzleGrid, row, col, val) {
    if ( 
      this.checkRowPlacement(puzzleGrid, row, col, val) &&
      this.checkColPlacement(puzzleGrid, row, col, val) &&
      this.checkRegionPlacement(puzzleGrid, row, col, val)
      ) { return true; } else { return false; };
  }

  validateGrid(puzzleGrid) {
    let testGrid = puzzleGrid.map(arr => [...arr]);
    let result = true;
    testGrid.forEach((row, i) => {
      row.forEach((col, c) => {
      if(col !== '.') {
        testGrid[i][c] = '.';
        if(!this.checkForFailed(testGrid, rowNum[i], (c+1), col)) {
          result = false;
        };
      } 
      })
    });
    return result;
  }

  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' }
    } else if (!(/^[\.1-9]+$/g).test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' }
    } else {
      return puzzleString;
    }
  }

  validateCheckInput(row, col, val) {
    if (rowNum.indexOf(row) === -1  || col > 9 || col < 1) { 
      return { error: 'Invalid coordinate'}
    } else if ((/\D/).test(val) || val > 9 || val < 1) {
      return { error: 'Invalid value' }
    } else {
      return { result: 'validated' };
    }
  }

  checkCoordinates(puzzleGrid, row, col, val) {
    if (val.toString() === puzzleGrid[rowNum.indexOf(row)][col-1]) {
      return true;
    } else {
      return false;
    }
  }

  checkRowPlacement(puzzleGrid, row, col, val) {
    if (puzzleGrid[rowNum.indexOf(row)].includes(val.toString())) {
      return false;
    } else {
      return true;
    }
  }

  checkColPlacement(puzzleGrid, row, col, val) {
    for (let i = 0; i < 9; i++) {
      if (puzzleGrid[i][col-1] == val) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleGrid, row, col, val) {
    const regionRow = Math.floor(rowNum.indexOf(row) / 3) * 3;
    const regionCol = Math.floor((col-1) / 3) * 3;

    for (let i = 0; i < 3; i++) {
      for (let c = 0; c < 3; c++) {
        if(puzzleGrid[regionRow + i][regionCol + c] === val.toString()) {
          return false
        }
      }
    }
    return true;
  }

  solve(puzzleGrid) {
    let empty = this.checkForEmpty(puzzleGrid);
    let row = empty[0];
    let col = empty[1];
    let result;

    // there is no more empty spots
    if (row === -1){
        result = { solution: puzzleGrid.flat().join('') };
        return result;
       };

    for( let val = 1; val <= 9; val++ ){
        if (this.checkForFailed(puzzleGrid, rowNum[row], (col +1), val)){
            puzzleGrid[row][col] = val.toString();
            this.solve(puzzleGrid);
        }
    }
    
    if (this.checkForEmpty(puzzleGrid)[0] !== -1) {
      puzzleGrid[row][col] = '.';
    }

    result = { solution: puzzleGrid.flat().join('') };
    return result;
    
  }
}

module.exports = SudokuSolver;

