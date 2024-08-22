import React from 'react';
import './StaticSudoku.css';

function StaticSudoku() {
  return (
    <div className="container">
      <div className="title">SUDOKU</div>
      {/* <div className="subtitle">STATIC GRID</div> */}
      <div className="grid">
        {Array.from({ length: 9 }).map((_, rowIndex) => (
          <div key={rowIndex} className="row">
            {Array.from({ length: 9 }).map((_, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="cell"
              >
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StaticSudoku;
