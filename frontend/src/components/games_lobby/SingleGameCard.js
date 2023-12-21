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

    if(game){
    return (
    <>
        <a href={`/${game.endpoint}/${game._id}`}>
            {game.title} #{game._id.substring(18)}:  
            {game.player_two ? 
                ` ${game.player_one.username} vs. ${game.player_two.username}` : 
                ` ${game.player_one.username} is awaiting an opponent`}
        </a>

        {game.player_one !== sessionUserID && game.awaiting_challenger && <button>Join Game</button>}

        {game.player_one === sessionUserID && game.awaiting_challenger && <button>Delete Game</button>}

        {game.player_one === sessionUserID && !game.awaiting_challenger && <button>Forfeit Game</button>}
        {game.player_two === sessionUserID && !game.awaiting_challenger && <button>Forfeit Game</button>}

    </>
    )
}else{
    return(<>Fetching Game Data...</>)
}

}

export default SingleGameCard;