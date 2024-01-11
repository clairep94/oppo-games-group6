import React, {useState, useRef, useEffect} from "react";
import {useParams} from "react-router-dom";
import { newGame, fetchGame, allGames, placePiece, forfeitGame } from "../../api_calls/tictactoeAPI";
import io from "socket.io-client";


export default function TTTGamePage({ token, setToken, sessionUserID, sessionUser }) {

    const background = 'TTT.jpg'
    const mapName = 'Alpine Map'

    // ============================= STATE VARIABLES ===========================================
    // --------- Session & Game ID ----------
    const { id } = useParams(); // IMPORTANT: DO NOT RENAME 'id' This refers to gameID but changing it would cause issues in routes etc.
    const gameID = id; // declared gameID variable to store this info in case it is more readable for usage below:

    // ------- Game state variables & Finding win: ----------
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

    const findOpponent = (game) => {
        if (!game.playerTwo) {
            return ": Awaiting Challenger"
        } else if (sessionUserID === game.playerOne._id) {
            return ` vs. ${game.playerTwo.username}`
        } else if (sessionUserID === game.playerTwo._id) {
            return ` vs. ${game.playerOne.username}`
        }
    }


    // ===================== LOADING THE BOARD ====================================
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


    // ============ SESSION USER GAMEPLAY =================================
    // Function to place a piece on the gameboard
    const handlePlacePiece = async(row, col) => {
        const coordinates = `${row}${col}`
        console.log(`Coordinates: ${row} ${col}`)

        // check if there is a second player:
        if (!game.playerTwo) {
            console.log("Must wait for player two!")
            setErrorMessage("You must wait for player two to join")

        // check if the space is already occupied:
        } else if (game.xPlacements.includes(coordinates) || game.oPlacements.includes(coordinates)){
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

    // =================== OPPONENT GAMEPLAY ========================================
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
                // TO DO!!! SOCKET ADD METHOD HERE
                ;})
            }}



    // ============================== TAILWIND ==============================================
    const frostedGlass = ` bg-gradient-to-r from-gray-300/30 via-purple-100/20 to-purple-900/20 backdrop-blur-sm
    shadow-lg shadow-[#363b54] border-[3px] border-white/10 `
    const headerContainer = 'flex flex-row w-full h-[8rem] rounded-[1.5rem] p-10 pl-[5rem] justify-right'

    // =================================== JSX FOR UI ==============================================================
    if(game){
        return (
        // BACKGROUND
        <div
            className=" flex flex-row items-center justify-center pl-[10rem] pr-[2rem] py-[1rem]"
            style={{ backgroundImage: `url(/backgrounds/${background})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh' }}>
            {/* PAGE CONTAINER */}
            <div className='flex flex-col w-full h-full justify-between space-y-5'>
                {/* HEADER */}
                <div className={headerContainer + frostedGlass + 'justify-between items-center'}>
                    {/* HEADER GREETING */}
                    <div className='flex flex-col space-y-5'>
                        <h3 className='text-5xl text-white font-extrabold'>
                            Tic-Tac-Toe{game && findOpponent(game)}
                        </h3>
                    </div>
                </div>
    
    
                {/* GAMES CONTAINER -- this is the max size of the game, actual game board is inside */}
                <div className="flex flex-col items-center justify-center  h-full w-full">

                    {/* TTT CONTAINER */}
                    <div className={"flex flex-col bg-gray-500/60 w-[40rem] h-[40rem] items-center justify-between py-[4rem] rounded-[2rem]" +  frostedGlass}>
    
                        {/* OPPONENT & TURN HEADER */}
                        {game.playerTwo ? (   
                                <p className="text-3xl font-bold">Whose turn: {" "}
                                    <span className="text-3xl font-bold">{sessionUserID === game.playerOne._id ? game.playerTwo.username: game.playerOne.username}</span>
                                </p>
                        ):( <p className="text-3xl font-bold">Awaiting player two</p>)}

                        {/* TTT GAME BOARD */}
                        <TicTacToeBoard gameBoard={game.gameBoard} onButtonClick={handlePlacePiece}/>
                        
                        {/* FORFEIT BUTTON-- only shows if sessionUser is a player && game is not over */}
                        {!game.finished && game.playerTwo && (sessionUserID === game.playerOne._id || sessionUserID === game.playerTwo._id) &&
                            (<button onClick={handleForfeit} className="bg-black/70 p-4 w-[13rem] rounded-lg">
                                {forfeitButtonMessage}
                            </button>)
                        }
                        
                        {errorMessage && 
                            <h2 className="text-red-600/80 font-semibold text-2xl p-3">{errorMessage}</h2>}

                        
                        {winMessage && 
                        <h2 className="text-white font-bold text-3xl p-3">
                            {winMessage}
                        </h2>
                        }
    
    
    
                    </div>
                </div>
    
    
                {/* MESSAGES container */}
                <div className='flex flex-col h-[22%]'>
                    <h3 className='text-3xl text-white font-extrabold ml-3'>
                        Messages
                    </h3>
                    <div className="flex flex-col bg-gray-600/40 rounded-[1rem] h-full overflow-y-auto px-5 py-2 border-2 space-y-1 border-white/20">
                        <div className="flex flex-col h-full overflow-auto">
                            MESSAGES
                        </div>
                        <div className="flex flex-col h-2/5 bg-white/10 rounded-lg border-2 border-white/20 p-2">
                            Write a message... 
                        </div>
                    </div>
                </div>
    
    
    
            </div>        
        </div>        
    
        )
    }
}



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
                            className="h-[6rem] w-[6rem] mb-2 bg-slate-300/60 border-2 border-white/20 shadow-sm text-black rounded-md mr-1 hover:bg-slate-400 text-bold"
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
