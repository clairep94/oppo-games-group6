import './App.css';
import React, { useState } from 'react';

import {
  useNavigate,
  Routes,
  Route,
} from "react-router-dom";

import LoginForm from '../auth/LoginForm'
import SignUpForm from '../sign_up/SignUpForm'
import GamesLobby from '../games_lobby/GamesLobby';
import TicTacToe from '../../games/tictactoe/TicTacToe';
import ProfilePage from '../profile_page/ProfilePage';


const App = () => {
    return (
        <Routes>
          <Route path='/lobby'  element={<GamesLobby navigate={ useNavigate() }/>}/>
          <Route path='/login'  element={<LoginForm  navigate={ useNavigate() }/>}/>
          <Route path='/signup' element={<SignUpForm navigate={ useNavigate() }/>}/>
          <Route path='/tictactoe/:id' element={<TicTacToe navigate={useNavigate()} />} />
          <Route path='/users/:id' element={<ProfilePage navigate={useNavigate()}/>} />

        </Routes>
    );
}

export default App;
