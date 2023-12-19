import SingleGameCard from "./SingleGameCard"

const GamesList = (props) => {

    // This shows a scrollable list of game cards
    // Feed the required list of game objects -- eg. open games, your games, etc.

    const gamesList = props.gamesList //list of game objects -- open games, your games, etc.
    const sessionUserID = props.sessionUserID

    return (
        <>
        <div style={{ height: '200px', overflowY: 'scroll', border: '1px solid #ccc', padding: '5px', width: '70%' }}>
    
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {gamesList.map((game, index) => (
                <li key={index} style={{ borderBottom: '1px solid #eee', padding: '5px' }}>
                    <SingleGameCard game={game} sessionUserID={sessionUserID}/>
                </li>
                ))}
            </ul>
        </div>
        </>
    
    )

}

export default GamesList;