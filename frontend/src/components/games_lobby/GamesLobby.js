import React, { useEffect, useState } from 'react';
import NewGameButton from './CreateNewGameButton';
import GamesList from './GamesList';


const GamesLobby = ({ navigate, token, setToken, sessionUserID, sessionUser, setSessionUser }) => {

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
        <div className='mr-10'>
          {/* TITLE CARD */}

        <img src='gameControllers.png' className='w-[36rem] absolute right-2 bottom-0 -z-10 opacity-80'/>
        
        <div className='h-[10rem] pl-12 py-6 relative
          bg-gradient-to-r from-gray-300/20 via-purple-100/20 to-purple-900/20
          -translate-x-2 backdrop-blur-sm
          shadow-lg shadow-[#363b54] rounded-[1.5rem] border-[3px] border-white/10'>
          <h3 className='text-[2.7rem] font-semibold'>
              {`Hello, @${sessionUser?.username}`}
          </h3>
          <p className='text-white/40 text-[1.4rem]'>
              Welcome back to our platform
          </p>
        </div>
        <img src='triangles.jpg' className='h-[9.5rem] rounded-[1.5rem] -translate-x-5 absolute -z-10 w-[88%] -translate-y-[10rem]'></img>

        <h1 className='text-6xl font-bold my-10'>
          GAME LOBBY
        </h1>

        <div className='w-[5rem] h-[5rem] border-[0.3rem] rounded-full border-white/80 shadow-lg opacity-80'>
          <img src={`https://api.dicebear.com/7.x/rings/svg?seed=${sessionUserID}`} alt="avatar" />
        </div>



<br></br>
<div class="h-[18rem] w-[18rem] rounded-[3.4rem] bg-gradient-to-br from-pink-300 via-pink-500 to-pink-500 p-2">
        <img src='tictactoe.png' alt='Tic Tac Toe' className='w-[17rem] z-20 absolute -translate-y-[5rem] translate-x-6' />
        <h2 className='absolute z-20 font-semibold text-[2.5rem] translate-x-6 translate-y-[12.5rem]'>Tic-Tac-Toe</h2>
    <div class="flex h-full w-full items-center justify-center bg-pink-400 rounded-[3rem] relative shadow-pink-400 shadow-md opacity-80">
        
        <div class="absolute inset-0 backdrop-blur-sm rounded-[3rem]"></div>
    </div>
</div>



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
        </div>
      )
    } else {
      navigate('/login')
    }
}




export default GamesLobby;
