import React, {useState} from "react";
import styles from './TicTacToe.module.css'

// THE BELOW IS JUST AN EXAMPLE TO DEMONSTRATE FE
// Ideally we would fetch the instance of the game from the BE with the game._id 

// ======== SINGLE BUTTON ===========//
// ideally load {tictactoeGame}
const TicTacToeButtonTest = ({ row, col, turnNum, setTurnNum }) => {
    const [buttonActive, setButtonActive] = useState(true);
    const [space, setSpace] = useState(" ");

    const handleCoordinateSelection = async (event) => {
      // skipping FE/BE connection for now:
      // this button would actually write to the DB for this specific TicTacToe game
        console.log(`Selected: Row ${row}, Col ${col}`);
        setButtonActive(false);

      // ideally there is also logic that checks whether the user is X or O
        if (turnNum % 2 === 0) {
            setSpace("X");
            setTurnNum(turnNum + 1);

            //temp logic
            // setXPlacements(XPlacements.append(`${row}${col}`))
            // function for checking for wins which includes set-winner

        } else {
            setSpace("O");
            setTurnNum(turnNum + 1);

            //temp logic
            // setYPlacements(YPlacements.append(`${row}${col}`))
            // function for checking for wins which includes set-winner
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
const TicTacToeTest = ({ navigate }) => {
    // would have states such as gameFinished, etc.
    const [turnNum, setTurnNum] = useState(0)
    const [winner, setWinner] = useState(null)

    // ========== GAME LOGIC ============
    
    // temporary, will be replaced with above:
    const rowA = [1, 2, 3]
    const rowB = [1, 2, 3]
    const rowC = [1, 2, 3]
    
    const checkForWinner = () => {
        console.log("Check for winner function")
        //if .....
            // setWinner("O")
        //else if...
            // setWinner("X")
    }



    // ideally this component would continuously access the DB to watch
    // for board changes & re-render when the board is changed

    // for the board:
        // for row in boardMatrix:
            // row.key
            // for col in row:
                // {TicTacToeButton(row, col, setTurnNum)}
            // <br>





    const logout = () => {
        window.localStorage.removeItem("token")
        navigate('/login')
        }

    
    return (
        <>
        <h2>TicTacToe Test</h2>
        <p>This is to demonstrate the FE buttons, see the console logs to see how button press is captured!</p>

        <div id='test-ttt-board'>
            <div id='test-row-a'>
                {rowA.map(
                    (col) => ( <TicTacToeButtonTest 
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
                    (col) => ( <TicTacToeButtonTest
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
                    (col) => ( <TicTacToeButtonTest 
                                    row={ "C" } 
                                    col= {col} 
                                    turnNum={turnNum}
                                    setTurnNum={setTurnNum}
                                />)
                )}
                <br/>
            </div>
        </div>

        {winner && <p aria-label="Winner Announcement">{winner} wins!</p>}

        <button onClick={logout}>
              Logout
            </button>
        </>
    )


}

export default TicTacToeTest;