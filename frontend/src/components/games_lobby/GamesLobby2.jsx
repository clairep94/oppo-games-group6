import React, { useEffect, useState } from 'react';
import NewGameButton from './CreateNewGameButton';
import GamesList from './GamesList';
import gameCardBattle from "../../assets/BS2.jpg"
import gameCardTTT from "../../assets/TTT.jpg"
import gameCardRPS from "../../assets/RPS.jpg"
import gameCardAll from "../../assets/allGames.png"



const GamesLobby = ({ navigate, token, setToken, sessionUserID, sessionUser, setSessionUser }) => {


  // ======= GAME DATA ================
  const [allGames, setAllGames] = useState(null); // ---> USE FILTERING METHOD
  const [displayGames, setDisplayGames] = useState(null);

  const gamesMenu = [ // <------- LIST OF ENDPOINTS, TITLES, IMAGE SOURCES FOR EACH GAME!! --> USE TO MAP OVER THE CARDS
    {
      title:'Tic-Tac-Toe', 
      endpoint: 'tictactoe',
    },
    {
      title:'Rock-Paper-Scissors', 
      endpoint: 'rps'
    },
    {
      title: 'Battleships', 
      endpoint: 'battleships'
    }
  ] 


  // ============= GETTING ALL GAMES ================= //
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


  // =========== CREATING A GAME =================== //


  // =========== JOINING A GAME =================== //



  // ======= GAME LIST VIEW ==============    
  const [viewTitle, setViewTitle] = useState("All"); // ---> Controls view of the games list: "All", "Open", "Your", "TTT", "RPS", "BS"

  const showGames = (view) => { // Function that filters using the corresponding view
    setViewTitle(view)
    switch (view) {
      case "All":
        setDisplayGames(allGames);
        break;

      case "Open":
        const openGames = allGames.filter(game => game.awaitingOpponent === true);
        setDisplayGames(openGames);
        break;

      case "Your":
        const yourGames = allGames.filter(game => game.playerOne._id === sessionUserID || game.playerTwo._id === sessionUserID);
        setDisplayGames(yourGames);
        break;

      case "Tic-Tac-Toe":
        const tttGames = allGames.filter(game => game.endpoint === '/tictactoe');
        setDisplayGames(tttGames);
        break;

      case "Rock-Paper-Scissors":
        const rpsGames = allGames.filter(game => game.endpoint === '/rps');
        setDisplayGames(rpsGames);
        break;

      case "Battleships":
        const bsGames = allGames.filter(game => game.endpoint === '/battleships');
        setDisplayGames(bsGames);
        break;

      default:
        console.log("Invalid view");
        // Code for handling an invalid view
    }
};





  // =========== TAILWIND ==============
  const frostedGlass = ` bg-gradient-to-r from-gray-300/20 via-purple-100/20 to-purple-900/20 backdrop-blur-sm
  shadow-lg shadow-[#363b54] border-[3px] border-white/10
  `
  const headerContainer = 'flex flex-row w-full h-[8rem] rounded-[1.5rem] p-10 pl-[10rem] justify-right'


  // ============== JSX FOR UI ========================

    if(token) {
      return(
        // BACKGROUND
        <div
            className=" flex flex-row items-center justify-center pl-[10rem] pr-[2rem] py-[1rem]"
            style={{ backgroundImage: 'url(/backgrounds/Welcome2.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh' }}>

          {/* PAGE CONTAINER */}
          <div className='flex flex-col w-full h-full justify-between'>

            {/* HEADER */}
            <div className={headerContainer + frostedGlass + 'justify-between items-center'}>
              {/* HEADER GREETING */}
              <div className='flex flex-col space-y-5'>
                <h3 className='text-5xl text-white font-extrabold'>
                  Welcome back, {sessionUser?.username}
                </h3>
              </div>
            </div>

            
            {/* PAGE BOTTOM SECTION */}
            <div className='flex flex-col h-[50%] justify-between space-y-2'>
              
              <h3 className='text-4xl text-white font-extrabold'>Our Games</h3>

              {/* OUR GAMES - GAME CARDS WHERE YOU CAN SELECT TO CREATE A GAME OR VIEW OPEN GAMES OR VIEW CURRENT GAMES*/}
              <div className='flex flex-row bg-gray-600/40 rounded-[1rem] h-[60%] overflow-x-scroll pt-3 pl-2 pr-2 pb-6 border-2 space-x-3 border-white/20'>

                  {/* ALL GAMES CARD */}
                  <div className='h-[full] min-w-[18rem] rounded-[1rem] overflow-clip flex flex-col relative text-black hover:cursor-pointer opacity-90 hover:opacity-100'>
                      <img class="object-cover object-center w-full h-full rounded-xl" src={'/backgrounds/allGames.png'} alt="ttt" />
                      <figcaption class="absolute bottom-8 left-2/4 transform flex w-[calc(100%-4rem)] -translate-x-2/4 justify-between rounded-xl border border-white bg-white/75 py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
                          <div class="transition-opacity hover:opacity-0 h-[4rem]">
                          <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                            All Games
                          </h5>
                          <p class="block mt-2 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                            View games of all types
                          </p>

                          </div>
                          {/* <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                          426 players online
                          </h5> */}
                      </figcaption>
                  </div>

                  {/* SINGLE CARD */}
                  <div className='h-[full] min-w-[35rem] rounded-[1rem] overflow-clip flex flex-col relative text-black hover:cursor-pointer  transition-opacity opacity-90 hover:opacity-100'>
                      <img class="object-cover object-center w-full h-full rounded-xl" src={gameCardTTT} alt="ttt" />
                      <figcaption class="absolute bottom-8 left-2/4 transform flex w-[calc(100%-4rem)] -translate-x-2/4 justify-between rounded-xl border border-white bg-white/75 py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
                          <div class="transition-opacity hover:opacity-50">
                            <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                                Tic-Tac-Toe
                            </h5>
                            <p class="block mt-2 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                                Play in the Icy Alpines
                            </p>
                            </div>
                            <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                            234 players online
                            </h5>
                      </figcaption>
                  </div>

                {/* SINGLE CARD */}
                  <div className='h-[full] min-w-[35rem] rounded-[1rem] overflow-clip flex flex-col relative text-black hover:cursor-pointer opacity-90 hover:opacity-100'>
                      <img class="object-cover object-center w-full h-full rounded-xl" src={gameCardRPS} alt="ttt" />
                      <figcaption class="absolute bottom-8 left-2/4 transform flex w-[calc(100%-4rem)] -translate-x-2/4 justify-between rounded-xl border border-white bg-white/75 py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
                          <div class="transition-opacity hover:opacity-0">
                          <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                              Rock, Paper, Scissors
                          </h5>
                          <p class="block mt-2 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                              Play in the Mellow Meadow
                          </p>
                          </div>
                          <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                          108 players online
                          </h5>
                      </figcaption>
                  </div>

                  {/* SINGLE CARD */}
                  <div className='h-[full] min-w-[35rem] rounded-[1rem] overflow-clip flex flex-col relative text-black hover:cursor-pointer opacity-90 hover:opacity-100'>
                      <img class="object-cover object-center w-full h-full rounded-xl" src={gameCardBattle} alt="ttt" />
                      <figcaption class="absolute bottom-8 left-2/4 transform flex w-[calc(100%-4rem)] -translate-x-2/4 justify-between rounded-xl border border-white bg-white/75 py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
                          <div class="transition-opacity hover:opacity-0">
                          <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                              Battleships
                          </h5>
                          <p class="block mt-2 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                              Play in the Rocky River
                          </p>
                          </div>
                          <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                          84 players online
                          </h5>
                      </figcaption>
                  </div>
              </div>

              {/* LIST OF GAMES DEPENDING ON THE VIEW */}
              <h3 className='text-3xl text-white font-extrabold'>
                {viewTitle}{' '}Games
              </h3>

              <div className='flex flex-col bg-gray-600/40 rounded-[1rem] h-[40%] overflow-x-scroll pt-3 pl-2 pr-2 pb-6 border-2 space-x-3 border-white/20'>
                <p className='text-2xl opacity-70'>
                  Game
                </p>
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


