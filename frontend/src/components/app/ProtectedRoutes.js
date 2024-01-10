import React, { useState, useEffect, useRef } from 'react';
import {
  useNavigate,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useSessionTimeOutCheck } from '../../utility/LoggedInCheck';
import getSessionUserID from '../../utility/getSessionUserID';
import LoginPopup from '../auth/LoginPopup';
import { findUser } from '../../api_calls/usersAPI';

import NavBar from '../navbar/NavBar';
import GamesLobby from '../games_lobby/GamesLobby';
import TicTacToe from '../../games/tictactoe/TicTacToe';
import ProfilePage from '../profile_page/ProfilePage';

import GamePage from '../game-page/GamePage';



const ProtectedRoutes = ({navigate}) => {
  
  // =========== TOKEN & SESSION USER DATA =======================
  const [token, setToken] = useState(window.localStorage.getItem('token'));
  const sessionUserID = getSessionUserID(token);
  const [sessionUser, setSessionUser] = useState(null);

  // On component mount, get sessionUser Data
  useEffect(() => {
    if (token && sessionUserID) {
      findUser(token, sessionUserID)
      .then(userData => {
        window.localStorage.setItem("token", userData.token)
        setToken(window.localStorage.getItem("token"))
        setSessionUser(userData.user);
        console.log(userData.user);
        console.log(sessionUserID)
          })
        }
    },[])

  // ============= LOGIN POPUP & TIMEOUT CHECKER ===================   
  const showLoginPopup = !useSessionTimeOutCheck(); // checks every 5 seconds if token is valid and changes true/false


  // =================== JSX FOR COMPONENT =================================== 
  if(token && sessionUserID) {
    return (
    <div className='h-screen w-screen flex flex-row overflow-scroll'> 
    {/* FULL PAGE */}
  
      {/* LOGGED OUT POPUP */}
      {showLoginPopup && 
        <div className='z-40 absolute h-full w-full'>
          <LoginPopup navigate={navigate} />
        </div>
        }
  
      {/* NAV BAR */}
      <div className='z-30 absolute h-full flex py-[1rem]'>
        <NavBar navigate={navigate} token={token} setToken={setToken} 
          sessionUserID={sessionUserID} sessionUser={sessionUser} setSessionUser={setSessionUser}
        />
      </div>
  

      {/* =============== MAIN PAGE ============================= */}
      <div className='h-full w-full flex flex-col overflow-none ml-[10.5rem] text-gray-50 m-[3rem]'>
  
        <Routes>
          {/* ------ Lobby ------  */}
          <Route path='/'  element={<GamesLobby navigate={navigate} token={token} setToken={setToken} 
              sessionUserID={sessionUserID} sessionUser={sessionUser} setSessionUser={setSessionUser}/>}/>
          
          {/* ------ User Profile ------  */}
          <Route path='/users/:id'  element={<ProfilePage navigate={navigate} token={token} setToken={setToken} 
              sessionUserID={sessionUserID} sessionUser={sessionUser} setSessionUser={setSessionUser}/>}/>


          {/* ------ Tictactoe ------  */}
          <Route path='/tictactoe/:id'  element={<TicTacToe navigate={navigate} token={token} setToken={setToken} 
              sessionUserID={sessionUserID} sessionUser={sessionUser} setSessionUser={setSessionUser}/>}/>
  
          {/* -------- RPS ----------- */}
          <Route path='/rps/:gameId' element={<GamePage navigate={ navigate } gameTitle={ "Rock Paper Scissors" }/>}/>

          {/* ---- Battleships ---- */}
          <Route path='/battleships/:gameId' element={<GamePage navigate={ navigate } gameTitle={ "Battleships" }/>}/>

        </Routes>

      </div>
      
      {/* BACKGROUND GRADIENTS */}
      <div className="-z-10 absolute top-[6rem] right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] bg-[#8e6464]/90"></div>
      <div className="-z-10 absolute top-[1rem]  left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] bg-[#4f4c6e]"></div>
      {/* BACKGROUND COLOUR */}
      <div className='absolute -z-20 h-screen w-screen bg-gray-900 '></div>
        
        
    </div>
    );

  }
}

export default ProtectedRoutes;
