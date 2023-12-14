import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import styles from './TicTacToe.module.css';
import getSessionUserID from "../../utility/getSessionUserID";


// ======== PAGE ============ //
const TicTacToePage = ({ navigate }) => {

    const logout = () => {
        window.localStorage.removeItem("token")
        navigate('/login')
        }

    
    return (
        <>  
            {/* <TicTacToe
            tictactoeGame={tictactoeGame}
            setTicTacToeGame={setTicTacToeGame}
            /> */}

            <button onClick={logout}>
                Logout
            </button>
        </>

    )
}

// ========================== MAIN: BOARD ================================================= //

const TicTacToe = ({ navigate }) => {

    // =========== STATE VARIABLES ==========================
    // --------- Session & Game ID ----------
    const { id } = useParams(); // IMPORTANT: DO NOT RENAME 'id' This refers to gameID but changing it would cause issues in routes etc.
    const gameID = id; // declared gameID variable to store this info in case it is more readable for usage below:
    const [token, setToken] = useState(window.localStorage.getItem("token"));
    const sessionUserID = getSessionUserID(token);

    // ------- Game states ----------
    const [game, setGame] = useState(null);
    const [gameBoard, setGameBoard] = useState(null);
    const [winner, setWinner] = useState(null);
    const rows = ["A", "B", "C"];


    // ============ LOADING THE BOARD =============
    // Function 1: to fetch the tictactoe data.
    const fetchGame = () => {
        fetch(`/tictactoe/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((res) => res.json())
        .then((data) => {
            window.localStorage.setItem("token", data.token)
            setToken(window.localStorage.getItem("token"))
            setGame(data.game)
            setGameBoard(data.game.game_board)
            setWinner(data.game.winner)
        })
    }

    // Use Function 1 once page is loaded:
    useEffect(() => {
        if(token) {
            fetchGame()
        }
    }, []);

    // ============ SESSION USER GAMEPLAY =============

    // Function 2: Allows players to PlacePiece, which returns the updated game.data, and sets the updated game board.
    const updateGameBoard = async (row, col) => { 
        console.log(`Player ${sessionUserID} Selected: Row ${row}, Col ${col}`);

        //1) Updating the GameBoard with the piece:
        try {
            const response = await fetch(`/tictactoe/${id}/place_piece`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    row: row, 
                    col: col
                })
            })
            const data = await response.json();
            setGame(data.game);
            setGameBoard(data.game.game_board);
        } catch (error) {
            console.error(error)
        }

        //2) Checking for a winner:
        try {
            const response = await fetch(`/tictactoe/${id}/check_win`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    row: row, 
                    col: col
                })
            })
            const data = await response.json();
            setWinner(data.game.winner); // TODO CHANGE THIS FOR A DRAW!
        } catch (error) {
            console.error(error)
        }

    }

    // ============ OPPONENT GAMEPLAY =============



    // ============ JSX FOR THE UI =============
    return (
        <>
            <h2>TicTacToe</h2>
            <p>Seeing if I can get the game data at all:</p>
            <p>{gameID ? gameID: "Cannot get game ID from Params"}</p>
            <p>{game ? "Game object found" : "No game object found"}</p>
            <p>{game ? game._id : "No game object found"}</p>
            <p>{game ? game.whose_turn : "No game object found"}</p>
            <p>{game ? `Winner found: ${game.winner}` : "No winner found"}</p>
            <p>{sessionUserID}</p>


            {game && game.game_board && (
                <div>
                <p>Game Board:</p>
                <table>
                    <tbody>
                    {Object.keys(game.game_board).map((row) => (
                        <tr key={row}>
                        {Object.keys(game.game_board[row]).map((col) => (
                            <td key={col}>{game.game_board[row][col]}</td>
                        ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}


            {game && gameBoard && (
                <div id='tictactoe-board'>
                    {rows.map((row) => (
                        <div key={row}>
                            {Object.keys(gameBoard[row]).map((col) => (
                            <TicTacToeButton
                                key={`${row}${col}`}
                                row={row}
                                col={col}
                                winner={winner}
                                gameBoard={gameBoard}
                                handleClick={() => updateGameBoard(row, col)}
                            />
                                ))}
                        </div>
                        ))}
                </div>
            )}

        {winner && <p aria-label="Winner Announcement">{winner} wins!</p>}
        </>
    );
};

// =========== SUPPORTIVE COMPONENTS: ==================================== //

// ======== SINGLE BUTTON ===========//
const TicTacToeButton = (props) => {
    const space = props.gameBoard[props.row][props.col]
    // const buttonActive = space === " "
    const buttonActive = space === " " && props.winner.length === 0;

    return (
        <button
            aria-label={`${props.row}${props.col} button`}
            onClick={props.handleClick}
            className={buttonActive ? "active-ttt-space" : "inactive-ttt-space"}
            disabled={!buttonActive}
            style={{ width: "100px", height: "100px" }}
        >
            <span style={{ display: "inline-block", minWidth: "100%" }}>{ space }</span>
        </button>
    );
};

export default TicTacToe;
