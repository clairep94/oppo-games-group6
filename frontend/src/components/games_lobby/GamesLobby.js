import React, { useEffect, useState } from 'react';
// import Post from '../post/Post'

const GamesLobby = ({ navigate }) => {
  // const [posts, setPosts] = useState([]); //will change to available_games, setAvailableGames
  const [token, setToken] = useState(window.localStorage.getItem("token"));

  //TODO: Update with TicTacToeGames.Index
  // useEffect(() => {
  //   if(token) {
  //     fetch("/posts", {
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       }
  //     })
  //       .then(response => response.json())
  //       .then(async data => {
  //         window.localStorage.setItem("token", data.token)
  //         setToken(window.localStorage.getItem("token"))
  //         setPosts(data.posts);
  //       })
  //   }
  // }, [])
    

  const logout = () => {
    window.localStorage.removeItem("token")
    navigate('/login')
  }

  const newTicTacToeGame = async (event) => {
    event.preventDefault()

    try {
      const response = await fetch('/tictactoe', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({}),
      });
  
      if (response.status === 201) {
        const data = await response.json();
        const gameID = data.game._id;
        navigate(`/tictactoe/${gameID}`);
      } else {
        navigate('/signup');
      }
    } catch (error) {
      console.error('Error creating new TicTacToe game:', error);
      navigate('/signup');
    }
  };

  

    if(token) {
      return(
        <>
          <h2>Games Lobby</h2>
          <button onClick={newTicTacToeGame}>
              New TicTacToe Game
          </button>

          <a href='/tictactoetest'>Go to demo game</a>

            <button onClick={logout}>
              Logout
            </button>
          {/* <div id='available_games' role="available_games">
              {games.map(
                (game) => ( <Game game={ game } key={ game._id } /> )
              )}
          </div> */}
        </>
      )
    } else {
      navigate('/login')
    }
}

export default GamesLobby;
