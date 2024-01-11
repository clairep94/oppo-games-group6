import './App.css';
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';


import InfoPage from '../info-page/InfoPage';

import {
  useNavigate,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { isLoggedIn } from '../../utility/LoggedInCheck';

import LoginForm from '../auth/LoginForm'
import SignUpForm from '../sign_up/SignUpForm'
// import GamesLobby from '../games_lobby/GamesLobby';
// import TicTacToe from '../../games/tictactoe/TicTacToe';
import ProfilePage from '../profile_page/ProfilePage';
import Landing from '../landing/Landing';
import ProtectedRoutes from './ProtectedRoutes';
//import MessagePage from '../messages/MessagePage';

const App = () => {
  const navigate = useNavigate();
  
  return (
    
    <Routes>
      {/* ====== NO AUTHENTICATION - Sign Up or Login: ======== */}

      <Route path='/rps' element={<InfoPage navigate={ useNavigate() } gameTitle={ "Rock Paper Scissors" }/>}/>
      {/* <Route path='/rps/:gameId' element={<GamePage navigate={ useNavigate() } gameTitle={ "Rock Paper Scissors" }/>}/> */}

      <Route path='/welcome'  element={!isLoggedIn() ?

      <Landing navigate={ navigate }/> : <Navigate to='/'/>}/>


      <Route path='/signup' element={ !isLoggedIn() ?
      <SignUpForm navigate={navigate}/> : <Navigate to='/'/>}/>
      
      <Route path='/login' element={ !isLoggedIn() ?
        <LoginForm navigate={navigate}/> : <Navigate to='/'/>}/>

      {/*<Route path='/message' element={ !isLoggedIn() ?
        <MessagePage navigate={navigate}/> : <Navigate to='/message'/>}/>

      {/* ====== AUTHENTICATION ONLY - Lobby, Games, etc. : ======== */}
      <Route path='/*'  element={ isLoggedIn() ?         
        <ProtectedRoutes navigate={navigate}/> : <Navigate to='/welcome'/>}/>
        
    </Routes>
  )}
export default App;
