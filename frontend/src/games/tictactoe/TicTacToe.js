import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import { newGame, fetchGame, allGames, placePiece, forfeitGame } from "../../api_calls/tictactoeAPI";


const TicTacToe = ({ navigate, token, setToken, sessionUserID, sessionUser, setSessionUser }) => {

    // =========== STATE VARIABLES ==========================
    // --------- Session & Game ID ----------
    const { id } = useParams(); // IMPORTANT: DO NOT RENAME 'id' This refers to gameID but changing it would cause issues in routes etc.
    const gameID = id; // declared gameID variable to store this info in case it is more readable for usage below:

    // ------- Game state variables ----------
    const [game, setGame] = useState(null); // stores game object retrieved from DB
    const [whoseTurn, setWhoseTurn] = useState(null); // this needs to be stored and updated explicitly due to issues with game.turn

    const [winMessage, setWinMessage] = useState(null); // same as above but with game.winner.length
    const [errorMessage, setErrorMessage] = useState(null);
    const [forfeitButtonMessage, setForfeitButtonMessage] = useState("Forfeit Game")

    const findWinMessage = (game) => {
        if (game.winner.length === 0) {
            setWinMessage('');
        } else if (game.winner.length === 2) {
            setWinMessage("It's a draw!");
        } else {
            if (game.winner[0]._id === sessionUserID) {
                setWinMessage("You win!")
            } else {
                setWinMessage(`${game.winner[0].username} wins!`)
            }
        }
        };
    
    const timeInterval = 2000;


    // ============ LOADING THE BOARD =============
    // Get the board from the DB once the component is loaded.
    // TODO: check if I should re-run findWinMessage(game) within a hook.
    useEffect(() => {
        if (token) {
            fetchGame(token, gameID)
            .then(gameData => {
                window.localStorage.setItem("token", gameData.token);
                setToken(window.localStorage.getItem("token"));
                setGame(gameData.game);
                setWhoseTurn((gameData.game.turn % 2 === 0) ? gameData.game.playerOne : gameData.game.playerTwo)
                findWinMessage(gameData.game)
            })
        }
    }, [])


    // ============ SESSION USER GAMEPLAY =============
    // Function to place a piece on the gameboard
    // TODO: add error message on the page for when user tries to play out of turn or if the user is not in the game.
    const handleClick = (row, col) => {

        // check if the sessionUserID === whoseTurn._id
        console.log(`Coordinates: ${row} ${col}`)
    }

    // ============ OPPONENT GAMEPLAY =============
    // Function to run findGame for this particular game every 2 seconds to check for opponents' moves.

    // ============ FORFEIT GAME ==================
    // Function to forfeit game -- first sets warning message, then forfeits game.
    const handleForfeit = async (event) => {
        event.preventDefault();

        if (forfeitButtonMessage === "Forfeit Game"){
            setForfeitButtonMessage("Are you sure?")
        }
        if (token && (forfeitButtonMessage === "Are you sure?")) {
            forfeitGame(token, gameID)
            .then(gameData => {
                window.localStorage.setItem("token", gameData.token);
                setToken(window.localStorage.getItem("token"));
                setGame(gameData.game);})
            }}

    // ============ JSX FOR THE UI =============
    if (game) {
        return (
            <>
                <h1 className="text-6xl">
                NEW TICTACTOE GAME:
                </h1>
                <p>Visibility Testing:</p>
                <p>GameID: {game._id}</p>
                <p>Player One: {game.playerOne.username}, Placements: {game.xPlacements}</p>
                <p>Player Two: {game.playerTwo.username}, Placements: {game.oPlacements}</p>
                <p>Game Finished: {String(game.finished)}</p>
                <p>Game Winners: {game.winner.length}</p>
                <p>Game Turn Number: {game.turn}</p>
                <p>Which player is SessionUser? : {sessionUserID === game.playerOne._id ? "Player One" : "Player Two or Observer"}</p>
                <p>Whose Turn? {whoseTurn.username}</p>
                <p>Is it my turn? {String(whoseTurn._id === sessionUserID)}</p>

                <br></br>

                {winMessage}

                <TicTacToeBoard gameBoard={game.gameBoard} onButtonClick={handleClick}/>
                
                {/* Forfeit button -- only shows if sessionUser is a player && game is not over */}
                {!game.finished && (sessionUserID === game.playerOne._id || sessionUserID === game.playerTwo._id) &&
                    (<button onClick={handleForfeit} className="bg-black/70 p-4 w-[13rem] rounded-lg">
                        {forfeitButtonMessage}
                    </button>)
                }

                {errorMessage}
            </>
        )
    }
};

// =========== SUPPORTIVE COMPONENTS: ==================================== //

const TicTacToeBoard = ({ gameBoard, onButtonClick }) => {

    const rows = Object.keys(gameBoard);

    return (
        <div className="tictactoe-board">
        {rows.map(row => (
            <div key={row} className="tictactoe-row">
            {Object.keys(gameBoard[row]).map(col => (
                <button
                key={col}
                    className="h-[5rem] w-[5rem] bg-slate-300 shadow-sm text-black rounded-md mr-1 hover:bg-slate-400"
                    onClick={() => onButtonClick(row, col)}
                >
                {gameBoard[row][col]}
                </button>
            ))}
            </div>
        ))}
        </div>
    );
};





// ======== SINGLE BUTTON ===========//
const TicTacToeButton = (props) => {
    const space = props.gameBoard[props.row][props.col]
    const buttonActive = space === " " && !props.winMessage && !props.opponentsTurn;

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
