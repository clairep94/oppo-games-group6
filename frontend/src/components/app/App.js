import './App.css';
import React, { useState } from 'react';

import RpsInfoPage from '../InfoPage/RpsInfoPage';

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

const App = () => {
  const navigate = useNavigate();
  
  return (
    
    <Routes>
      {/* ====== NO AUTHENTICATION - Sign Up or Login: ======== */}

      <Route path='/rps' element={<RpsInfoPage navigate={ useNavigate() } gameTitle={ "Rock Paper Scissors" }/>}/>
      {/* <Route path='/rps/:gameId' element={<GamePage navigate={ useNavigate() } gameTitle={ "Rock Paper Scissors" }/>}/> */}

      
      <Route path='/welcome'  element={!isLoggedIn() ?
      <Landing navigate={navigate}/> : <Navigate to='/'/>}/>

      <Route path='/signup' element={ !isLoggedIn() ?
      <SignUpForm navigate={navigate}/> : <Navigate to='/'/>}/>
      
      <Route path='/login' element={ !isLoggedIn() ?
        <LoginForm navigate={navigate}/> : <Navigate to='/'/>}/>

      {/* ====== AUTHENTICATION ONLY - Lobby, Games, etc. : ======== */}
      <Route path='/*'  element={ isLoggedIn() ?         
        <ProtectedRoutes navigate={navigate}/> : <Navigate to='/login'/>}/>
        
    </Routes>
  )}
export default App;



// emerald-400 
// emerald-700
// purple-700