import { useState, useEffect, useRef } from 'react';
import '../App.css';
import sudokuData from "../JSON/sudoku";
import { LuAlarmClock } from "react-icons/lu";

function SolveSudoku({ successMessage, setSuccessMessage }) {
  const [grid, setGrid] = useState([]);
  const [submitted, setSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [preFilledCells, setPreFilledCells] = useState(Array.from({ length: 9 }, () => Array(9).fill(false)));
  const [errorCells, setErrorCells] = useState(Array.from({ length: 9 }, () => Array(9).fill(false)));
  const [correctValues, setCorrectValues] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(Math.floor(Math.random() * sudokuData.sudokuBoards.length));
  const [modifiedCells, setModifiedCells] = useState(Array.from({ length: 9 }, () => Array(9).fill(false)));
  const [seconds, setSeconds] = useState(0);
  const errorMessageRef = useRef(null);

  useEffect(() => {
    loadSudokuBoard(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [currentIndex]);  

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        handleNext();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const loadSudokuBoard = (index) => {
    const board = sudokuData.sudokuBoards[index];
    setGrid(board);

    const newPreFilledCells = board.map(row => row.map(cell => cell !== ''));
    setPreFilledCells(newPreFilledCells);
    setErrorCells(Array.from({ length: 9 }, () => Array(9).fill(false)));

    const solutionBoard = JSON.parse(JSON.stringify(board));
    findNum(solutionBoard);
    setCorrectValues(solutionBoard);

    setSeconds(0);
  };

  const handleChange = (row, col, value) => {
    if (value === '' || (value >= '1' && value <= '9')) {
      const newGrid = grid.map((r, rowIndex) =>
        rowIndex === row
          ? r.map((c, colIndex) => (colIndex === col ? value : c))
          : r
      );

      const newErrorCells = Array.from({ length: 9 }, () => Array(9).fill(false));

      const newModifiedCells = modifiedCells.map((r, rowIndex) =>
        rowIndex === row
          ? r.map((c, colIndex) => (colIndex === col ? true : c))
          : r
      );

      for (let i = 0; i < 9; i++) {
        if (i !== col && newGrid[row][i] === value && value !== '') {
          newErrorCells[row][col] = true;
          newErrorCells[row][i] = true;
        }
        if (i !== row && newGrid[i][col] === value && value !== '') {
          newErrorCells[row][col] = true;
          newErrorCells[i][col] = true;
        }
      }

      const subgridRowStart = Math.floor(row / 3) * 3;
      const subgridColStart = Math.floor(col / 3) * 3;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const r = subgridRowStart + i;
          const c = subgridColStart + j;
          if ((r !== row || c !== col) && newGrid[r][c] === value && value !== '') {
            newErrorCells[row][col] = true;
            newErrorCells[r][c] = true;
          }
        }
      }

      setGrid(newGrid);
      setErrorCells(newErrorCells);
      setModifiedCells(newModifiedCells);
      setErrorMessage('');
      setSuccessMessage('');
    }
  };

  const handleSubmit = () => {
    const newErrorCells = Array.from({ length: 9 }, () => Array(9).fill(false));
    let isValid = true;

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (modifiedCells[row][col] && grid[row][col] !== correctValues[row][col] && grid[row][col] !== "") {
          newErrorCells[row][col] = true;
          isValid = false;
        }
      }
    }

    if (isValid) {
      if (isBoardComplete(grid)) {
        setSubmit(true);
        setErrorMessage('');
        setSuccessMessage('YOU PLAYED WELL');
      } else {
        setErrorMessage('INPUTS GIVEN TILL NOW ARE CORRECT, PLEASE FILL THE REMAINING CELLS!!');
      }
    } else {
      setErrorCells(newErrorCells);
      setErrorMessage('INVALID SUDOKU INPUTS. PLEASE ENTER CORRECT INPUTS.');

      setTimeout(() => {
        setErrorCells(Array.from({ length: 9 }, () => Array(9).fill(false)));
      }, 3000);
    }
    console.log("Error Cells:", newErrorCells);
  };

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

  function isBoardComplete(board) {
    return board.every(row => row.every(cell => cell !== ''));
  }

  const handleReset = () => {
    loadSudokuBoard(currentIndex);
    setSubmit(false);
    setErrorMessage('');
    setSuccessMessage('');
    setSeconds(0); 
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % sudokuData.sudokuBoards.length;
    setCurrentIndex(nextIndex);
    setSubmit(false);
    setErrorMessage('');
    setSuccessMessage('');
    setSeconds(0);
  };

  useEffect(() => {
    if (errorMessage && errorMessageRef.current) {
      errorMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [errorMessage]);

  return (
    <div className="container">
      <div className="title">SUDOKU</div>
      <div className="subtitle">SOLVE THE SUDOKU PUZZLE</div>
      <div className="timer" style={{ display: 'flex', alignItems: 'center', marginBottom: "15px" }}>
        <LuAlarmClock style={{ marginRight: '8px', fontSize: '24px' }} /> 
        {formatTime(seconds)}
      </div>
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
                  backgroundColor: errorCells[rowIndex][colIndex]
                    ? 'red'
                    : preFilledCells[rowIndex][colIndex]
                      ? 'lightgreen'
                      : 'white',
                  cursor: submitted ? 'not-allowed' : 'text',
                  borderRight: colIndex % 3 === 2 ? '3px solid #000' : '1px solid',
                  borderBottom: rowIndex % 3 === 2 ? '3px solid #000' : '1px solid',
                }}
                maxLength={1}
                disabled={preFilledCells[rowIndex][colIndex] || submitted}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="button-container">
        <button onClick={handleSubmit} disabled={submitted}>CHECK</button>
        <button onClick={handleReset}>RESET</button>
        <button onClick={handleNext}>NEXT</button>
      </div>

      {errorMessage && (
        <div ref={errorMessageRef} className="error-message">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default SolveSudoku;
