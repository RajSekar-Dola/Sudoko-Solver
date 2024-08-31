import { useState, useEffect, useRef } from 'react';
import '../App.css';

function InputsSudoku({ buttonShow }) {
  const [grid, setGrid] = useState(Array.from({ length: 9 }, () => Array(9).fill('')));
  const [userFilled, setUserFilled] = useState(Array.from({ length: 9 }, () => Array(9).fill(false)));
  const [submitted, setSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [invalidCells, setInvalidCells] = useState(Array.from({ length: 9 }, () => Array(9).fill(false)));

  const errorMessageRef = useRef(null);

  const handleChange = (row, col, value) => {
    if (value === '' || (value >= '1' && value <= '9')) {
      const newGrid = grid.map((r, rowIndex) =>
        rowIndex === row
          ? r.map((c, colIndex) => (colIndex === col ? value : c))
          : r
      );

      const newUserFilled = userFilled.map((r, rowIndex) =>
        rowIndex === row
          ? r.map((c, colIndex) => (colIndex === col ? value !== '' : c))
          : r
      );

      const newInvalidCells = newGrid.map((r, rowIndex) =>
        r.map((c, colIndex) => 
          newUserFilled[rowIndex][colIndex] && !isValidSudoku(newGrid, rowIndex, colIndex, c)
        )
      );

      setGrid(newGrid);
      setUserFilled(newUserFilled);
      setInvalidCells(newInvalidCells);
      setErrorMessage('');
    }
  };

  const handleSubmit = () => {
    const board = grid.map(row =>
      row.map(cell => (cell === '' ? '' : cell.toString()))
    );

    const newInvalidCells = Array.from({ length: 9 }, () => Array(9).fill(false));

    // Check for invalid cells
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (userFilled[i][j] && !isValidSudoku(board, i, j, board[i][j])) {
          newInvalidCells[i][j] = true;
        }
      }
    }

    if (isBoardValid(board) && findNum(board)) {
      setGrid(board);
      setSubmit(true);
      setErrorMessage('');
    } else {
      setInvalidCells(newInvalidCells);
      setErrorMessage('INVALID SUDOKU INPUTS. PLEASE ENTER CORRECT INPUTS.');

      // Highlight invalid cells in red for 3 seconds
      setTimeout(() => {
        setInvalidCells(Array.from({ length: 9 }, () => Array(9).fill(false)));
      }, 3000);
    }
  };

  function isBoardValid(board) {
    const isValidUnit = (unit) => {
      const seen = new Set();
      for (const num of unit) {
        if (num !== '' && seen.has(num)) return false;
        seen.add(num);
      }
      return true;
    };

    for (let row = 0; row < 9; row++) {
      if (!isValidUnit(board[row])) return false;
    }

    for (let col = 0; col < 9; col++) {
      const column = board.map(row => row[col]);
      if (!isValidUnit(column)) return false;
    }

    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const subgrid = [];
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            subgrid.push(board[3 * boxRow + row][3 * boxCol + col]);
          }
        }
        if (!isValidUnit(subgrid)) return false;
      }
    }

    return true;
  }

  function isValidSudoku(board, row, col, c) {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === c && i !== col) return false;
      if (board[i][col] === c && i !== row) return false;

      let subGridRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      let subGridCol = 3 * Math.floor(col / 3) + (i % 3);
      if (
        board[subGridRow][subGridCol] === c &&
        (subGridRow !== row || subGridCol !== col)
      )
        return false;
    }
    return true;
  }

  function findNum(board, row = 0, col = 0) {
    if (col === 9) {
      col = 0;
      row++;
      if (row === 9) return true;
    }

    if (board[row][col] !== '') {
      return findNum(board, row, col + 1);
    }

    for (let num = 1; num <= 9; num++) {
      let c = num.toString();
      if (isValidSudoku(board, row, col, c)) {
        board[row][col] = c;
        if (findNum(board, row, col + 1)) {
          return true;
        }
        board[row][col] = '';
      }
    }

    return false;
  }

  const handleReset = () => {
    setSubmit(false);
    setGrid(Array.from({ length: 9 }, () => Array(9).fill('')));
    setUserFilled(Array.from({ length: 9 }, () => Array(9).fill(false)));
    setInvalidCells(Array.from({ length: 9 }, () => Array(9).fill(false)));
    setErrorMessage('');
  };

  useEffect(() => {
    if (errorMessage && errorMessageRef.current) {
      errorMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [errorMessage]);

  return (
    <div className="container">
      <div className="title">SUDOKU</div>
      <div className="subtitle">ENTER SUDOKU INPUTS</div>
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((value, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                type="text"
                value={value}
                onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                className="cell"
                style={{
                  backgroundColor: invalidCells[rowIndex][colIndex]
                    ? 'red'
                    : userFilled[rowIndex][colIndex]
                      ? 'lightgreen'
                      : 'white',
                  cursor: submitted ? 'not-allowed' : 'text',
                  borderRight: colIndex % 3 === 2 ? '3px solid #000' : "1px solid ",
                  borderBottom: rowIndex % 3 === 2 ? '3px solid #000' : "1px solid ",
                }}
                maxLength={1}
                disabled={submitted}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="button-container">
        <button onClick={handleSubmit} disabled={submitted} style={{ display: buttonShow ? "inline-block" : "none" }}>SUBMIT</button>
        <button onClick={handleReset} style={{ display: buttonShow ? "inline-block" : "none" }}>RESET</button>
      </div>

      {errorMessage && (
        <div ref={errorMessageRef} className="error-message">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default InputsSudoku;
