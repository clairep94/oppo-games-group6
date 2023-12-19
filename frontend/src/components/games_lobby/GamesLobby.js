import React, { useEffect, useState } from 'react';
import getSessionUserID from "../../utility/getSessionUserID";
import NewGameButton from './CreateNewGameButton';



const GamesLobby = ({ navigate }) => {

  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const sessionUserID = getSessionUserID(token);

  const gamesMenu = [ // <------- LIST OF ENDPOINTS & TITLES FOR EACH GAME!!
    {title:'Tic-Tac-Toe', endpoint: 'tictactoe'},
    {title:'Rock-Paper-Scissors', endpoint: 'rockpaperscissors'},
    {title: 'Battleships', endpoint: 'battleships'}
  ] 


  const [openGames, setOpenGames] = useState(null);
  const [yourGames, setYourGames] = useState(null);
  const [allGames, setAllGames] = useState(null);


  // ============= TEMP: ALL GAMES SECTION ================= //
  useEffect(() => {
    if(token) {
      fetch("/tictactoe", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(async data => {
          window.localStorage.setItem("token", data.token)
          setToken(window.localStorage.getItem("token"))
          setAllGames(data.games);
        })
    }
  }, [])


  // ============= LOGOUT ======================== //
  const logout = () => {
    window.localStorage.removeItem("token")
    navigate('/login')
  }

  // ============== JSX FOR UI ========================

    if(token) {
      return(
        <>
        {/* TODO: ADD NAVBAR */}
          {/* TITLE */}
          <h2>Games Lobby</h2>
          <button onClick={logout}>
            Logout
          </button>

          <a href={`/users/${sessionUserID}`}>
            <p>Welcome player {sessionUserID}</p>
          </a>
          {/* TITLE */}

          <br></br>

          {/* SESSION USER'S GAMES - ONGOING & OPEN TOGETHER */}
          <div id='your-games-section'>
            <h3>Your games:</h3>
            TODO: Your games. Each game has a link, and shows the Game Type, GameID + Forfeit or Delete button based on if there's an opponent
          </div>
          {/* SESSION USER'S GAMES - ONGOING & OPEN TOGETHER */}

          <br/>
          <hr></hr>
          <br/>

          {/* CREATE A GAME - BUTTON FOR EACH GAME TYPE - gameType.urlEndpoint & gameType.title */}
          <div id='create-game-section'>
            <h3>Create a game:</h3>
            <div id='create-game-buttons'>
              {gamesMenu.map((game) => <>
              <NewGameButton 
                key={game.title} 
                gameTitle={game.title} 
                gameEndpoint={game.endpoint} 
                token={token} 
                navigate={navigate} />
              <br/>
              </>)}
            </div>
          </div>
          {/* CREATE A GAME - BUTTON FOR EACH GAME TYPE - gameType.urlEndpoint & gameType.title */}

          <br/>
          <hr></hr>
          <br/>

          {/* OPEN GAMES SECTION  */}
          <div id='open-games-section'>
            <h3>Join a game:</h3>
              TODO: Open games. Each game has a join button and a link, and shows the Game Type, GameID + Host ID
          </div>
          {/* OPEN GAMES SECTION  */}

          <br/>
          <hr></hr>
          <br/>

          <div id='temp-all-games'>
            <h3>Temp: All games:               Will change to the below later, this is just for 3pm:
            </h3>
              Checking if this is fetching games:
              <br/>
              {allGames ? 'games exist' : 'games not found'}
              <br/>
              {allGames ? `${allGames.length} games found` : 'games not found'}
              {allGames && <AllGames allGames={allGames} sessionUserID={sessionUserID}/>}
          </div>

          <br/>
          <br/>
        </>
      )
    } else {
      navigate('/login')
    }
}


// ============== SUPPORTIVE COMPONENTS ============================================== //

// ----------- NEW GAME BUTTON ---------------------- //
// const NewGameButton = (props) => {
//   const game = props.game
//   const token = props.token
//   const navigate = props.navigate
//   // const gameTitle = props.gameTitle

//   const createNewGame = async (event) => {
//     event.preventDefault()

//     try {
//       const response = await fetch(`/${game}`, {
//         method: 'post',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({}),
//       });
  
//       if (response.status === 201) {
//         const data = await response.json();
//         const gameID = data.game._id;
//         navigate(`/${game}/${gameID}`);
//       } else {
//         navigate('/login');
//       }
//     } catch (error) {
//       console.error(`Error creating new ${game} game:`, error);
//       navigate('/login');
//     }
//   };


//   return (
//     <button
//       aria-label={`create ${game} game button`}
//       onClick={createNewGame}
//       className={`create-${game}-game-button`}
//       id={`create-${game}-game-button`}
//       style={{width: "200px", height: "50px"}}
//     >
//       {`New ${game} game`}
//       {/* TODO: Fix this string to be title case */}
//     </button>
//   )

//   };


// ---------- TEMP ALL GAMES ------------------ //
const AllGames = (props) => {
  const allGames = props.allGames
  const sessionUserID = props.sessionUserID



  return(
    <>
    <div style={{ height: '200px', overflowY: 'scroll', border: '1px solid #ccc', padding: '5px', width: '70%' }}>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {allGames.map((game, index) => (
          <li key={index} style={{ borderBottom: '1px solid #eee', padding: '5px' }}>
            <SingleGame game={game} sessionUserID={sessionUserID}/>
          </li>
        ))}
      </ul>
    </div>
    </>
  )

}
const SingleGame = (props) => {
  const game = props.game
  const sessionUserID = props.sessionUserID

  return (
    <>
    <a href={`/tictactoe/${game._id}`}>Tictactoe #{game._id}: {game.player_two ? `${game.player_one} vs. ${game.player_two}` : `${game.player_one} awaiting opponent`}</a>
    {/* TODO: add join button, if open game; forfeit button if your game & not awaiting challenger */}
    {game.awaiting_challenger && <> <button>Join Game</button> <button>Delete Game</button></>}
    {/* {game.player_one === sessionUserID && <button>Delete Game</button>} */}
    {game.player_one === sessionUserID && !game.awaiting_challenger && <button>Forfeit Game</button>}
    {game.player_two === sessionUserID && !game.awaiting_challenger && <button>Forfeit Game</button>}



    </>
  )
}


export default GamesLobby;
