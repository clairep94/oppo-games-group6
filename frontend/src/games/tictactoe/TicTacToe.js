import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import styles from './TicTacToe.module.css';
import getSessionUserID from "../../utility/getSessionUserID";


// ==================== PAGE ===================================================== //
const TicTacToePage = ({ navigate }) => {

    // TODO: Shift GameID, token, sessionUserID here.

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
    const [game, setGame] = useState(null); // stores game object retrieved from DB
    const [gameBoard, setGameBoard] = useState(null); // game.game_board
    const [winner, setWinner] = useState(null); //game.winner
    
    const [opponentID, setOpponentID] = useState(null); // additional property to store opponent's turn -- this is to prevent re-rendering when the game is over.
    const [opponentsTurn, setOpponentsTurn] = useState(null); // checks if game.whose_turn === opponent, if so set to True and run the 5-sec game fetch to check for opponent moves
    const timeInterval = 5000;
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
            if (sessionUserID === data.game.player_one) {
                setOpponentID(data.game.player_two)
            } else {
                setOpponentID(data.game.player_two)
            }
            setOpponentsTurn(data.game.whose_turn === opponentID) 
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
                })
            })
            const data = await response.json();
            setWinner(data.game.winner); // TODO CHANGE THIS FOR A DRAW!
            if (winner.length !== 0) {
                setOpponentsTurn(data.game.whose_turn === opponentID) 
            }

        } catch (error) {
            console.error(error)
        }

    }

    // ============ OPPONENT GAMEPLAY =============

    // TODO make a version of fetchGame where no new token is given so that users can timeout! Otherwise the user will never timeout.

    // When it is the opponent's turn, we run fetchGame every 5 seconds to check for the opponent to make moves and if they win/draw/forfeit.
    useEffect(() => {
        let fiveSecFetchGame;
    
        const fetchGameWrapper = () => {
            fetchGame(); // Call fetchGame immediately when the effect runs
    
            // Set up an interval to call fetchGame every 5 seconds
            fiveSecFetchGame = setInterval(fetchGame, timeInterval);
        };
    
        // Check if it's the opponent's turn
        if (token && opponentsTurn) {
            fetchGameWrapper();
    
            // Cleanup function: clear the interval when !opponentsTurn
            return () => clearInterval(fiveSecFetchGame);
        } else {
            // Clear the interval when !opponentsTurn
            clearInterval(fiveSecFetchGame);
        }
    
        // Cleanup function for unmount or other cases
        return () => {
            // Additional cleanup logic if needed
        };
    }, [opponentsTurn]);



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
            <p>{game ? `Checking turn counter: ${game.turn}` : "No winner found"}</p>
            <p>{game ? `Checking game.whose_turn vs. sessionUserID: ${game.whose_turn} === ${sessionUserID}? ${game.whose_turn === sessionUserID}` : 'does not find whose turn'}</p>
            <p>{game && game.whose_turn === sessionUserID ? `Checking against opponents turn property: ${opponentsTurn}` : 'does not find whose turn'}</p>

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
