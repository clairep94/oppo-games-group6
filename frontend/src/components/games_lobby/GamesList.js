import SingleGameCard from "./SingleGameCard"

const GamesList = (props) => {

    // This shows a scrollable list of game cards
    // Feed the required list of game objects -- eg. open games, your games, etc.

    const gamesList = props.gamesList //list of game objects -- open games, your games, etc.
    const sessionUserID = props.sessionUserID

    return (
        <>
        <div className='h-[250px] overflow-scroll w-9/12 p-2 border-2 border-white/30 rounded-lg mt-5'>
    
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {gamesList.map((game, index) => (
                <li key={index} className='py-1 px-2'>
                    <SingleGameCard game={game} sessionUserID={sessionUserID}/>
                </li>
                ))}
            </ul>
        </div>
        </>
    
    )

}

export default GamesList;