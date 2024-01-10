import React, {useState, useRef, useEffect} from "react";
import {useParams} from "react-router-dom";
import { newGame, fetchGame, allGames, placePiece, forfeitGame } from "../../api_calls/tictactoeAPI";
import io from "socket.io-client";


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

    // ------------ STYLING STRINGS -----------------

    const frostedGlass = ` bg-gradient-to-r from-gray-300/30 via-purple-100/20 to-purple-900/20 backdrop-blur-sm
    shadow-lg shadow-[#363b54] border-[3px] border-white/10
    `
    const headerContainer = 'flex flex-row w-full h-[8rem] rounded-[1.5rem] p-10 pl-[10rem] justify-right'


    const frostedGlassContainerTexture = `
    backdrop-blur-md bg-purple-100/20 shadow-lg shadow-[#444a6b] border-[2.5px] border-white/10`

    // ============ JSX FOR THE UI =============
    if (game) {
        return (
        <div
            className=" flex flex-row items-center justify-center"
            style={{ backgroundImage: 'url(/backgrounds/islandfar.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh' }}>

          {/* PAGE CONTAINER */}
          <div className='flex flex-col w-full h-full justify-between'>

            {/* HEADER */}
            <div className={headerContainer + frostedGlass + 'justify-between items-center'}>
              {/* HEADER GREETING */}
              <div className='flex flex-col space-y-5'>
                <h3 className='text-5xl text-white font-extrabold'>
                  ALPINE MAP: TIC-TAC-TOE
                </h3>
              </div>
            </div>
            
            {/* INTRO & GAME CONTAINER */}
            <div className="flex flex-row">

                {/* INTRO CARD */}
                <div className={"flex flex-col w-1/3 p-10 rounded-[2rem] h-[28rem] justify-center" + frostedGlassContainerTexture}>
                    <p className="text-4xl italic pb-9">
                        Welcome to the Alpine Map, {sessionUser.username}.
                    </p>
                    <p className="italic font-light pb-4">
                        In this icy terrain, opponents must face off against each other ...<br></br> **DEVS: WRITE COPY HERE 

                    </p>

                    <p className="py-4 text-xl">
                        Your challenge will be {" "}
                        <span className="text-3xl font-bold">Tic-Tac-Toe</span>
                    </p>
                    
                    {game.playerTwo ? (
                        <>
                            <p className="pb-4 text-xl">
                                Your opponent is {" "}
                                <span className="text-3xl font-bold">{sessionUserID === game.playerOne._id ? game.playerTwo.username: game.playerOne.username}</span>
                            </p>

                            <p className="text-xl">
                                Whose turn: {" "}
                                <span className="text-3xl font-bold">{sessionUserID === game.playerOne._id ? game.playerTwo.username: game.playerOne.username}</span>
                            </p>
                        </>
                    ):(<>
                        <p>Awaiting player two</p>
                    </>)}
                </div>

                {/* GAME CONTAINER */}
                <div className={"flex flex-col w-2/4 ml-5 p-10 rounded-[2rem] h-[28rem]" + frostedGlassContainerTexture}>


                    <TicTacToeBoard gameBoard={game.gameBoard} onButtonClick={handlePlacePiece}/>
                    
                    {/* Forfeit button -- only shows if sessionUser is a player && game is not over */}
                    {!game.finished && game.playerTwo && (sessionUserID === game.playerOne._id || sessionUserID === game.playerTwo._id) &&
                        (<button onClick={handleForfeit} className="bg-black/70 p-4 w-[13rem] rounded-lg">
                            {forfeitButtonMessage}
                        </button>)
                    }
                    
                    <h2 className="text-red-400/80 font-semibold text-2xl">
                        {errorMessage}
                    </h2>

                    <h2 className="font-bold text-4xl pt-5">
                        {winMessage}
                    </h2>
                    
                </div>

            </div>

            <div className={"flex flex-col w-3/4 p-10 rounded-[2rem] h-[28rem] justify-between opacity-80 mt-[4rem]" + frostedGlassContainerTexture}>
                <h3 className="font-bold text-3xl">Chat container</h3>
                <div className="space-y-3">
                    {/* <p>{game.playerOne.username}: {'  '}Wow nice move</p>
                    <p>{game.playerTwo.username}: {'  '}Thanks man</p>
                    <p>{game.playerOne.username}: {'  '}Ok I'll get you next time</p>
                    <p>{game.playerTwo.username}: {'  '}lol sure</p>
                    <p>{game.playerOne.username}: {'  '}go again?</p>
                    <p>{game.playerTwo.username}: {'  '}ya sounds good</p> */}
                </div>
                <div className="rounded-lg border-2 p-3">
                    Write message here...
                </div>

            </div>
            {/* <p>Visibility Testing:</p>
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
            <p>Is it my turn? {String(whoseTurn._id === sessionUserID)}</p> */}

                <br></br>


</div>
            </div>
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
                            className="h-[5rem] w-[5rem] mb-2 bg-slate-300/60 border-2 border-white/20 shadow-sm text-black rounded-md mr-1 hover:bg-slate-400"
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
