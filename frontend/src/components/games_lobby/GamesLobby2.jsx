import React, { useEffect, useState } from 'react';
import NewGameButton from './CreateNewGameButton';
import GamesList from './GamesList';


const GamesLobby = ({ navigate, token, setToken, sessionUserID, sessionUser, setSessionUser }) => {

  const gamesMenu = [ // <------- LIST OF ENDPOINTS & TITLES FOR EACH GAME!!
    {title:'Tic-Tac-Toe', endpoint: 'tictactoe'},
    {title:'Rock-Paper-Scissors', endpoint: 'rps'},
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

  // =========== TAILWIND ==============
  const frostedGlass = ` bg-gradient-to-r from-gray-300/20 via-purple-100/20 to-purple-900/20 backdrop-blur-sm
  shadow-lg shadow-[#363b54] border-[3px] border-white/10
  `
  const headerContainer = 'flex flex-row w-full h-[10rem] rounded-[1.5rem] p-10 pl-[10rem] justify-right'


  // ============== JSX FOR UI ========================

  // CLAIRE NOTE: THE BELOW IS COMPLETELY WIP, PLEASE DO NOT TAKE AS FINAL, I WILL CLEAN THIS UP LATER

    if(token) {
      return(
        // BACKGROUND
        <div
            className=" flex flex-row items-center justify-center pl-[10rem] pr-[2rem] py-[1rem]"
            style={{ backgroundImage: 'url(/backgrounds/Welcome.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh' }}>

          {/* PAGE CONTAINER */}
          <div className='flex flex-col w-full h-full justify-between'>

            {/* HEADER */}
            <div className={headerContainer + frostedGlass + 'justify-between items-center'}>
              {/* HEADER GREETING */}
              <div className='flex flex-col space-y-5'>
                <h3 className='text-6xl text-white font-extrabold'>
                  Hello, {sessionUser?.username}
                </h3>
                <p className='text-2xl opacity-70'>
                  Welcome back to Oppo Games
                </p>
              </div>

              {/* TO DO: ADD GAME INVITES POPUP */}
              <div>
                <div className={'relative rounded-full py-4 mr-10 px-10 bg-[#2acf6ec8] border-[3px] border-white/10 text-lg font-semibold shadow-[#386049] shadow-md'}
                  onClick={()=>{console.log("View game invites here!")}}>
                  View Your Game Invites
                </div>

              </div>
            </div>

            <div>
            </div>
            
            {/* PAGE BOTTOM SECTION */}
            <div className='flex flex-col h-[60%] justify-between space-y-3'>
              {/* OUR GAMES - GAME CARDS WHERE YOU CAN SELECT TO CREATE A GAME OR VIEW OPEN GAMES OR VIEW CURRENT GAMES*/}
              <div className='flex flex-col bg-blue-100/50 h-[60%] rounded-xl overflow-x-auto p-3'>
                <p className='text-2xl opacity-80'>
                  Our Games
                </p>
                <div className='flex flex-row h-full w-full rounded-xl overflow-x-auto'>
                  <div>

                  </div>
                </div>
              </div>

              {/* LIST OF GAMES DEPENDING ON THE VIEW */}
              <div className='flex flex-col bg-green-100/50 h-[40%] rounded-xl overflow-x-auto p-3'>
                <p className='text-2xl opacity-70'>
                  Game
                </p>
                <div className='flex flex-row h-full w-full rounded-xl overflow-x-auto'>

                </div>
              </div>
            </div>



          </div>
        </div>
      )
    } else {
      navigate('/login')
    }
}




export default GamesLobby;
