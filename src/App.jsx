import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [grid, setGrid] = useState(Array.from({ length: 9 }, () => Array(9).fill('')));
  const [userFilled, setUserFilled] = useState(Array.from({ length: 9 }, () => Array(9).fill(false)));
  const [submitted, setSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const errorMessageRef = useRef(null);

  const handleChange = (row, col, value) => {
    if (value === '' || value >= '1' && value <= '9') {
      const newGrid = grid.map((r, rowIndex) =>
      (rowIndex === row
        ? r.map((c, colIndex) => (colIndex === col ? value : c))
        : r
      ));

      const newUserFilled = userFilled.map((r, rowIndex) =>
        rowIndex === row
          ? r.map((c, colIndex) => (colIndex === col ? value !== '' : c))
          : r
      );
      setGrid(newGrid);
      setUserFilled(newUserFilled);
      setErrorMessage('')
    }
  };

  const handleSubmit = () => {
    const board = grid.map(row =>
      row.map(cell => (cell === '' ? '' : cell.toString()))
    );
    console.log(board)
    if (isBoardValid(board)) {
      if (findNum(board)) {
        setGrid(board);
        setSubmit(true);
        setErrorMessage(''); // Clear error message on successful submission
      } else {
        setErrorMessage('The Sudoku puzzle cannot be solved.');
      }
    } else {
      setErrorMessage('INVALID SUDOKO INPUTS .PLEASE ENTER CORRECT INPUTS');
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
      if (board[row][i] === c) return false;
      if (board[i][col] === c) return false;

      let subGridRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      let subGridCol = 3 * Math.floor(col / 3) + (i % 3);
      if (board[subGridRow][subGridCol] === c) return false;
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
    setErrorMessage('')
  };

  useEffect(() => {
    if (errorMessage && errorMessageRef.current) {
      errorMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [errorMessage]);

  return (
    <> <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: '45px',          
        fontFamily: 'Arial, sans-serif', 
        fontWeight: 'bold',        
        textTransform: 'uppercase', 
        letterSpacing: '2px',      
        color: '#2E8B57',         
        textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
      }}>SUDOKO</div>
      <div style={{
        border: "2px groove black",
        width: 'fit-content',
        padding: '10px',
        margin: '10px auto',
        textAlign: 'center',
        background: 'lightGreen',
        borderRadius: '10px'
      }}>
        ENTER SUDOKU INPUTS
      </div>
      <div>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', height: '50px', marginBottom: rowIndex % 3 === 2 ? '10px' : '0' }}>
            {row.map((value, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                type="text"
                value={value}
                onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                style={{
                  width: '50px',
                  height: '50px',
                  textAlign: 'center',
                  color: value !== '' ? 'black' : '#999',
                  fontWeight: value !== '' ? 'bold' : 'normal',
                  marginRight: colIndex % 3 === 2 ? '10px' : '0',
                  borderRight: (colIndex % 3 === 2) ? '3px solid #000' : '1px solid #ccc',
                  borderBottom: (rowIndex % 3 === 2) ? '3px solid #000' : '1px solid #ccc',
                  backgroundColor: userFilled[rowIndex][colIndex] ? 'lightgreen' : 'white',
                  cursor: submitted ? 'not-allowed' : 'text',
                }}
                maxLength={1}
                disabled={submitted}
              />
            ))}
          </div>
        ))}
        <button onClick={handleSubmit} disabled={submitted} style={{ margin: '25px 25px', padding: '10px' }}>
          SUBMIT
        </button>
        <button onClick={handleReset} style={{ padding: '10px' }}>
          RESET
        </button>

        {errorMessage && (
          <div  ref={errorMessageRef}  style={{
            border: "2px groove black",
            width: 'fit-content',
            padding: '10px',
            margin: '10px auto',
            textAlign: 'center',
            background: 'black',
            color:'lightGreen',
            borderRadius: '10px'
          }}>
            {errorMessage}
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default App;