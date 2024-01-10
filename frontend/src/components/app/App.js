import './App.css';
import React, { useState } from 'react';

import InfoPage from '../info-page/InfoPage';
import GamePage from '../game-page/GamePage';

import {
  useNavigate,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { isLoggedIn } from '../../utility/LoggedInCheck';

import LoginForm from '../auth/LoginForm'
import SignUpForm from '../sign_up/SignUpForm'
import ProtectedRoutes from './ProtectedRoutes';

const App = () => {
  const navigate = useNavigate();
  
  return (
    
    <Routes>
      {/* ====== NO AUTHENTICATION - Sign Up or Login: ======== */}

      <Route path='/rps' element={<InfoPage navigate={ useNavigate() } gameTitle={ "Rock Paper Scissors" }/>}/>
      {/* <Route path='/rps/:gameId' element={<GamePage navigate={ useNavigate() } gameTitle={ "Rock Paper Scissors" }/>}/> */}

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
