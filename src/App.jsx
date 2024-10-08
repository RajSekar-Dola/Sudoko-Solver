import React, { useEffect, useState } from "react";
import InputsSudoku from "./components/GiveInputs";
import StaticSudoku from "./components/StaticSudoku";
import SolveSudoko from "./components/SolveSudoko";
import "./App.css";

function App() {
  const [showInputs, setShowInputs] = useState(false);
  const [showSolve, setShowSolve] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 600);

  const handleInput = () => {
    setShowInputs(true);
    setShowSolve(false);
  };

  const handleSolve = () => {
    setShowSolve(true);
    setShowInputs(false);
  };

  const handleResize = () => {
    setIsMobileView(window.innerWidth <= 600);
  };

  useEffect(() => {
    document.title = "SUDOKU";
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: isMobileView ? "column" : "row",
        }}
      >
        <div
          className="box1"
          style={{
            display: "flex",
            flexDirection: "column",
            border: "3px groove lightgreen",
            borderRadius: "10px",
            color: "green",
          }}
        >
          <div>CHOOSE ONE OPTION</div>
          <div>
            <button onClick={() => handleSolve()}>1.SOLVE PUZZLE</button>
            <button onClick={() => handleInput()}>2.INPUT SUDOKU</button>
          </div>
          {successMessage && <div className="success-message">{successMessage}</div>}
        </div>
        <div className="box2">
          {!showInputs && !showSolve && <StaticSudoku />}
          {showInputs && <InputsSudoku buttonShow={showInputs} />}
          {showSolve && <SolveSudoko successMessage={successMessage} setSuccessMessage={setSuccessMessage} />}
        </div>
      </div>
    </>
  );
}

export default App;
