import './App.css';
import LoginForm from '../auth/LoginForm'
import SignUpForm from '../user/SignUpForm'
import React, { useState } from 'react';
import io from 'socket.io-client' ;

// import Feed from '../feed/Feed'
import GamesLobby from '../games_lobby/GamesLobby';
import {
  useNavigate,
  Routes,
  Route,
} from "react-router-dom";

const App = () => {
    return (
        <Routes>
          <Route path='/lobby'  element={<GamesLobby navigate={ useNavigate() }/>}/>
          {/* <Route path='/posts'  element={<Feed navigate={ useNavigate() }/>}/> */}
          <Route path='/login'  element={<LoginForm  navigate={ useNavigate() }/>}/>
          <Route path='/signup' element={<SignUpForm navigate={ useNavigate() }/>}/>
        </Routes>
    );
}

export default App;
