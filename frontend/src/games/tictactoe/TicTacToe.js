import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import styles from './TicTacToe.module.css'

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
    console.log(id)
    const gameID = id

    const [game, setGame] = useState(null);
    // const [gameBoard, setGameBoard] = useState(null);
    // const [winner, setWinner] = useState(null);
    const rows = ["A", "B", "C"];

    const [token, setToken] = useState(window.localStorage.getItem("token"));


    useEffect(() => {
        if(token) {
            fetch(`/tictactoe/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(async data => {
                window.localStorage.setItem("token", data.token)
                setToken(window.localStorage.getItem("token"))
                setGame(data.game);
            })
        }
    }, [])


    // const fetchGame = async () => {
    //     try {
    //         const response = await fetch(`/tictactoe/${gameID}`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //         const data = await response.json();
    //         setGame(data.game);
    //         // setGameBoard(data.game.game_board);
    //         // setWinner(data.game.winner);
    //     } catch (error) {
    //         console.error('Error fetching game: ', error);
    //     }
    // };

    // useEffect(() => {
    //     if (token) {
    //         fetchGame();
    //     }
    // }, []);


    // const updateGameBoard = async (row, col) => {
    //     try {
    //         const response = await fetch(`/tictactoe/${gameID}/place_piece`, {
    //             method: 'put',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             body: JSON.stringify({ row: row, col: col }),
    //         });
    //         const data = await response.json();
    //         setGame(data.game);
    //         // setGameBoard(data.game.game_board);
    //         // setWinner(data.game.winner);
    //     } catch (error) {
    //         console.error('Error updating game: ', error);
    //     }
    // };



    // useEffect(() => {
    //     setGameBoard(game.game_board)
    //     setWinner(game.winner)
    // }, [game]);

    // const renderGameBoard = () => (
    //     <div id='tictactoe-board'>
    //         {rows.map((row) => (
    //             <div key={row}>
    //                 {Object.keys(gameBoard[row]).map((col) => (
    //                     <TicTacToeButton
    //                         key={`${row}${col}`}
    //                         row={row}
    //                         col={col}
    //                         gameBoard={gameBoard}
    //                         updateGameBoard={() => updateGameBoard(row, col)}
    //                     />
    //                 ))}
    //             </div>
    //         ))}
    //     </div>
    // );

    return (
        <>
            <h2>TicTacToe</h2>
            <p>Seeing if I can get the game data at all:</p>
            <p>{gameID ? gameID: "Cannot get game ID from Params"}</p>
            <p>{game ? "Game object found" : "No game object found"}</p>
            <p>{game ? game._id : "No game object found"}</p>
            <p>{game ? game.whose_turn : "No game object found"}</p>
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



            {/* {game && renderGameBoard()}
            {winner && <p aria-label="Winner Announcement">{winner} wins!</p>} */}
        </>
    );
};

// ======== SINGLE BUTTON ===========//
const TicTacToeButton = ({ row, col, gameBoard, updateGameBoard }) => {
    const [buttonActive, setButtonActive] = useState(gameBoard[row][col] === " ");
    const [space, setSpace] = useState(gameBoard[row][col]);

    const handleCoordinateSelection = async () => {
        if (buttonActive) {
            setButtonActive(false);
            updateGameBoard();
        }
    };

    return (
        <button
            aria-label={`${row}${col} button`}
            onClick={handleCoordinateSelection}
            className={buttonActive ? "active-ttt-space" : "inactive-ttt-space"}
            disabled={!buttonActive}
            style={{ width: "100px", height: "100px" }}
        >
            <span style={{ display: "inline-block", minWidth: "100%" }}>{space}</span>
        </button>
    );
};

export default TicTacToe;
