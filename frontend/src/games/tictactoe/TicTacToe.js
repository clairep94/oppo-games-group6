import React, {useState, useRef, useEffect} from "react";
import {useParams} from "react-router-dom";
import { newGame, fetchGame, allGames, placePiece, forfeitGame } from "../../api_calls/tictactoeAPI";
import io from "socket.io-client";
import { fetchMessages, addMessage } from "../../api_calls/messageAPI";


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

    const timeInterval = 2000; // time interval for manual polling

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

    
    // ============ LOADING THE BOARD =============
    // Function to fetch the tictactoe data
    const fetchGameData = () => {
        fetchGame(token, gameID) //TODO fix? this version of fetchGameData always refreshes the token so the user never times out
            .then(gameData => {
                window.localStorage.setItem("token", gameData.token);
                setToken(window.localStorage.getItem("token"));

                // repeat these when player places a piece or when we receive new data from opponent
                setGame(gameData.game);
                setWhoseTurn((gameData.game.turn % 2 === 0) ? gameData.game.playerOne : gameData.game.playerTwo)
                findWinMessage(gameData.game)
            })
    }

    // Get the board from the DB once the component is loaded.
    useEffect(() => {
        if (token) {
            fetchGameData()
        }
    }, [])


    // ============ SESSION USER GAMEPLAY =============
    // Function to place a piece on the gameboard
    const handlePlacePiece = async(row, col) => {
        const coordinates = `${row}${col}`
        console.log(`Coordinates: ${row} ${col}`)

        // check if the space is already occupied:
        if (game.xPlacements.includes(coordinates) || game.oPlacements.includes(coordinates)){
            console.log("already a piece here")
            setErrorMessage("There is already a piece here!")
        
        // check if game is already over:
        } else if (game.finished) {
            setErrorMessage("The game is already over!")

        // check if the sessionUserID === whoseTurn._id -> if not, setErrorMessage
        } else if (sessionUserID !== whoseTurn._id) {
            if (sessionUserID === game.playerOne._id || sessionUserID === game.playerTwo._id){
                setErrorMessage("It's not your turn!")
            } else {
                setErrorMessage("You're not in this game!")
            }
        
        // if all checks pass, place the piece and update game with returned game data
        } else {
            if (token) {
                const movePayload = {row: row, col: col}
                placePiece(token, gameID, movePayload)
                .then(gameData => {
                    window.localStorage.setItem("token", gameData.token);
                    setToken(window.localStorage.getItem("token"));

                    const updatedGame = gameData.game;
    
                    setGame(gameData.game);
                    setWhoseTurn((gameData.game.turn % 2 === 0) ? gameData.game.playerOne : gameData.game.playerTwo)
                    findWinMessage(gameData.game)
                    setErrorMessage("")

                    socket.current.emit("place-piece", {gameID, updatedGame})
                })
            }
        }
    }

    // ============ OPPONENT GAMEPLAY =============

    // ------------ Socket setup: -------------------------------
    const socket = useRef() //menu, chatwindow
    const [onlineUsers, setOnlineUsers] = useState(null);
    const [sendGame, setSendGame] = useState(null);
    const [receivedGame, setReceivedGame] = useState(null);

    // --------- CONNECTING TO SOCKET & ONLINE USERS -----------------
    // Connect to socket.io when users visit the messages page //TODO lift this to app after login?
    useEffect(()=> {
        socket.current = io('http://localhost:8800'); // this is the socket port
        socket.current.emit("add-new-user", sessionUserID, gameID); // send the sessionUserID to the socket server
        socket.current.emit("create-game-room", gameID);
        socket.current.on('get-users', (users)=>{
            setOnlineUsers(users)}) // get the onlineUsers, which should now include the sessionUserID
        

        socket.current.on("receive-game-update", ({ gameID, gameState }) => {
            console.log("received game from socket", gameState);
            setGame(gameState);
            setWhoseTurn(
                gameState.turn % 2 === 0
                ? gameState.playerOne
                : gameState.playerTwo
            );
            findWinMessage(gameState);
            setErrorMessage("");
        });
    
    }, [sessionUserID])



    // MESSAGING STATES BELOW:
    // const [onlineUsers, setOnlineUsers] = useState([]); //menu
    // const [sendMessage, setSendMessage] = useState(null); //chatwindow
    // const [receivedMessage, setReceivedMessage] = useState(null); //chatwindow, menu
    // const [sendNewConversation, setSendNewConversation] = useState(null); //menu

    const [messages, setMessages] = useState(null);

    useEffect(() => {
        fetchMessages(gameID) //TODO fix? this version of fetchGameData always refreshes the token so the user never times out
            .then(messagesData => {
                setMessages(messagesData.allMessages);
            })
    },


    [])




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
                setGame(gameData.game)
                findWinMessage(gameData.game)
                ;})
            }}

    // ============ JSX FOR THE UI =============
    if (game) {
        return (
            <>
                <h1 className="text-6xl">
                NEW TICTACTOE GAME:
                </h1>
                <p>Visibility Testing:</p>
                <p>YOUR USERNAME: {sessionUser.username}</p>
                <br></br>
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

                <TicTacToeBoard gameBoard={game.gameBoard} onButtonClick={handlePlacePiece}/>
                
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
    const rows = ["A", "B", "C"];

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
