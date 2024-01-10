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

    if(game && game.playerOne && game.playerTwo){
    return (
    <div className='bg-gray-500/50 rounded-lg py-7 px-7'>
        <a href={`/${game.endpoint}/${game._id}`}>
            {game.title} #{game._id.substring(18)}:  
            {game.playerTwo ? 
                ` ${game.playerOne.username} vs. ${game.playerTwo.username}` : 
                ` ${game.playerOne.username} is awaiting an opponent`}
        </a>

        {game.playerOne !== sessionUserID && game.awaiting_challenger && <button>Join Game</button>}

        {game.playerOne === sessionUserID && game.awaiting_challenger && <button>Delete Game</button>}

        {game.playerOne === sessionUserID && !game.awaiting_challenger && <button>Forfeit Game</button>}
        {game.playerTwo === sessionUserID && !game.awaiting_challenger && <button>Forfeit Game</button>}

    </div>
    )
}else{
    return(<>Fetching Game Data...</>)
}

}

export default SingleGameCard;