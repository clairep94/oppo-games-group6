const SingleGameCard = (props) => {

    // This card shows a link to the individual game,
    // Displays the Game Title, ID, and Player One vs. Player Two or Player One awaiting opponent
    // Has a join button if the game is waiting an opponent and session user is not the host.
    // Has a delete button if the game is the session user's and is waiting for an opponent.
    // Has a forfeit button if the session user is in the game, and the game is not awaiting an opponent.

    // TODO: Add JOIN GAME, FORFEIT GAME, and DELETE GAME FUNCTIONS HERE:

    const game = props.game
    const sessionUserID = props.sessionUserID

    // JOIN GAME
    // FORFEIT GAME
    // DELETE GAME

    if(game && game.playerOne){
    return (
    <div className='bg-gray-700/30 rounded-lg w-full px-10 py-5 flex flex-row justify-between'>
        <a href={`/tictactoe/${game._id}`}>
            {game.title} #{game._id.substring(18)}:  
            {game.playerTwo ? 
                ` ${game.playerOne.username} vs. ${game.playerTwo.username}` : 
                ` ${game.playerOne.username} is awaiting an opponent`}
        </a>

        <div className="flex flex-row space-x-3">
            {game.playerOne._id !== sessionUserID && !game.playerTwo && <button>Join Game</button>}

            {game.playerOne._id === sessionUserID && !game.playerTwo && <button>Delete Game</button>}

            {((game.playerOne._id === sessionUserID) || (game.playerTwo._id === sessionUserID)) && <button>Forfeit Game</button>}
        </div>

    </div>
    )
}else{
    return(<>Fetching Game Data...</>)
}

}

export default SingleGameCard;