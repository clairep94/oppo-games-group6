import './App.css';
import LoginForm from '../auth/LoginForm'
import SignUpForm from '../user/SignUpForm'
import React, { useState } from 'react';
// import Feed from '../feed/Feed'
import GamesLobby from '../games_lobby/GamesLobby';
import InfoPage from '../info-page/InfoPage';
import GamePage from '../game-page/GamePage';
import TicTacToe from '../../games/tictactoe/TicTacToe';
import TicTacToeTest from '../../games/tictactoe/TicTacToeTest';
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
          <Route path='/tictactoetest' element={<TicTacToeTest navigate={ useNavigate() }/>}/>
          <Route path='/tictactoe/:id' element={<TicTacToe navigate={useNavigate()} />} />
          <Route path='/rps' element={<InfoPage navigate={ useNavigate() } gameTitle={ "Rock Paper Scissors" }/>}/>
          <Route path='/rps/:gameId' element={<GamePage navigate={ useNavigate() } gameTitle={ "Rock Paper Scissors" }/>}/>
          
          
        </Routes>
    );
}

export default App;
