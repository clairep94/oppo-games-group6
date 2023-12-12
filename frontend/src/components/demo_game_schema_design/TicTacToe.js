import React, {useState} from "react";
import styles from './TicTacToe.module.css'

// ======== SINGLE BUTTON ===========//
//ideally we would fetch the instance of the game
//and load {row, col, tictactoeGame}
const TicTacToeButton = ({ row, col, turnNum, setTurnNum }) => {
    const [buttonActive, setButtonActive] = useState(true);
    const [space, setSpace] = useState(" ");
  
    const handleCoordinateSelection = async (event) => {
      // skipping FE/BE connection for now:
      // this button would actually write to the DB for this specific TicTacToe game
      console.log(`Selected: Row ${row}, Col ${col}`);
      setButtonActive(false);
  
      // ideally there is also logic that checks whether the user is X or O, but here we'll only use X
      if (turnNum % 2 === 0) {
        setSpace("X");
        setTurnNum(turnNum + 1);
      } else {
        setSpace("O");
        setTurnNum(turnNum + 1);
      }
    };
  
    return (
      <>
        <button
          aria-label={`${row}${col} button`}
          onClick={(event) => handleCoordinateSelection(event)}
          className={buttonActive ? "active-ttt-space" : "inactive-ttt-space"}
          disabled={!buttonActive}
          style={{ width: "100px", height: "100px" }}
        >
          <span style={{ display: "inline-block", minWidth: "100%" }}>{space}</span>
        </button>
      </>
    );
  };
  

// ======== BOARD ===========//
//ideally we would fetch the instance of the game
//and load {navigate, tictactoeGame}
const TicTacToe = ({ navigate }) => {
    // would have states such as gameFinished, etc.
    const [turnNum, setTurnNum] = useState(0)

    // ideally this is loaded from the tictactoeGame
    const boardMatrix = {
        A : [1, 2, 3],
        B : [1, 2, 3],
        C : [1, 2, 3]
    }

    // temporary:
    const rowA = [1, 2, 3]
    const rowB = [1, 2, 3]
    const rowC = [1, 2, 3]

    // ideally this component would continuously access the DB to watch
    // for board changes & re-render when the board is changed

    // for the board:
        // for row in boardMatrix:
            // row.key
            // for col in row:
                // {TicTacToeButton(row, col, setTurnNum)}
            // <br>

    return (
        <>
        <h2>TicTacToe</h2>

        <div id='test-ttt-board'>
            <div id='test-row-a'>
                {rowA.map(
                    (col) => ( <TicTacToeButton 
                                    row={ "A" } 
                                    col= {col} 
                                    turnNum={turnNum}
                                    setTurnNum={setTurnNum}
                                />)
                )}
                <br/>
            </div>

            <div id='test-row-b'>
                {rowB.map(
                    (col) => ( <TicTacToeButton 
                                    row={ "B" } 
                                    col= {col} 
                                    turnNum={turnNum}
                                    setTurnNum={setTurnNum}
                                />)
                )}
                <br/>
            </div>

            <div id='test-row-c'>
                {rowC.map(
                    (col) => ( <TicTacToeButton 
                                    row={ "C" } 
                                    col= {col} 
                                    turnNum={turnNum}
                                    setTurnNum={setTurnNum}
                                />)
                )}
                <br/>
            </div>
        </div>


        </>
    )


}

export default TicTacToe;