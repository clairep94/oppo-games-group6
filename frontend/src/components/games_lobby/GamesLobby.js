import React, { useEffect, useState } from 'react';
import getSessionUserID from "../../utility/getSessionUserID";
import NewGameButton from './CreateNewGameButton';
import NavBar from '../navbar/NavBar';
import GamesList from './GamesList';


const GamesLobby = ({ navigate }) => {

  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const sessionUserID = getSessionUserID(token);
  // const sessionUserData = 

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



  // ============== JSX FOR UI ========================

    if(token) {
      return(

        <>
        {/* TODO: NAVBAR, add user info here later */}
        <NavBar navigate={navigate} sessionUserID={sessionUserID}/>



          {/* TITLE */}
          <h2>Games Lobby</h2>

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

              {allGames && <GamesList gamesList={allGames} sessionUserID={sessionUserID}/>}
          </div>

          <br/>
          <br/>
        </>
      )
    } else {
      navigate('/login')
    }
}




export default GamesLobby;
