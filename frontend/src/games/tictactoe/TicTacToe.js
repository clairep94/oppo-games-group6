import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import styles from './TicTacToe.module.css';
import getSessionUserID from "../../utility/getSessionUserID";


// ======== PAGE ============ //
const TicTacToePage = ({ navigate }) => {

    // THE PAGE FETCHES THE GAME OBJECT, like with FEED -> posts are automatically updated this way?
    // useEffect here or in TicTacToe?

    // const {gameID} = useParams(); // Access gameID from the URL
    // const [tictactoeGame, setTicTacToeGame] = useState(null); // stores the game object once retrieved
    // const [token, setToken] = useState(window.localStorage.getItem("token"));

    // TO STORE AT THIS LEVEL: SessionID, SessionUser, token?

    // Fetch the game object when the page mounts
    // useEffect(() => {
    //     if(token) {
    //         fetch(`/tictactoe/${gameID}`, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         })
    //         .then(response => response.json())
    //         .then(async data => {
    //             window.localStorage.setItem("token", data.token)
    //             setToken(window.localStorage.getItem("token"))
    //             setTicTacToeGame(data.game);

    //     })
    // }
    // }, [])

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

// ======== BOARD ===========//
const TicTacToe = ({ navigate }) => {
    const { id } = useParams(); // IMPORTANT: DO NOT RENAME 'id' This refers to gameID but changing it would cause issues in routes etc.

    const gameID = id

    const [game, setGame] = useState(null);
    const [gameBoard, setGameBoard] = useState(null);
    // const [winner, setWinner] = useState(null);
    const rows = ["A", "B", "C"];

    const [token, setToken] = useState(window.localStorage.getItem("token"));

    const sessionUserID = getSessionUserID(token);

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
        })
    }

    // Use Function 1 once page is loaded:
    useEffect(() => {
        if(token) {
            fetchGame()
        }
    }, []);


    // Function 2: Allows players to PlacePiece, which returns the updated game.data, and sets the updated game board.
    const updateGameBoard = async (row, col) => { 
        console.log(`Player ${sessionUserID} Selected: Row ${row}, Col ${col}`);

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
    }


    return (
        <>
            <h2>TicTacToe</h2>
            <p>Seeing if I can get the game data at all:</p>
            <p>{gameID ? gameID: "Cannot get game ID from Params"}</p>
            <p>{game ? "Game object found" : "No game object found"}</p>
            <p>{game ? game._id : "No game object found"}</p>
            <p>{game ? game.whose_turn : "No game object found"}</p>
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
                                gameBoard={gameBoard}
                                handleClick={() => updateGameBoard(row, col)}
                            />
                                ))}
                        </div>
                        ))}
                </div>
            )}



            {/* {game && renderGameBoard()}
            {winner && <p aria-label="Winner Announcement">{winner} wins!</p>} */}
        </>
    );
};

// ======== SINGLE BUTTON ===========//
const TicTacToeButton = (props) => {
    const space = props.gameBoard[props.row][props.col]
    const buttonActive = space === " "

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
