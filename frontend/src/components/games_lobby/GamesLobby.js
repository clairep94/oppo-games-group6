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
          <div id='create-game-section'>
            <h3>Create a game:</h3>
            {/* TODO: Make this button into a function, and map per game */}
            <button onClick={newTicTacToeGame}>
                New TicTacToe Game
            </button>
            <br/>

            <button onClick={() => {console.log('placeholder for RPS')}}>
              New Rock Paper Scissors Game
            </button>
            <br/>
          </div>

          <br/>
          <br/>

          <div id='open-games-section'>
            <h3>Join a game:</h3>
              TODO: Open games. Each game has a join button and a link, and shows the Game Type, GameID + Host ID
              {/* <div id='available_games' role="available_games">
                  {games.map(
                    (game) => ( <Game game={ game } key={ game._id } /> )
                  )}
              </div> */}
          </div>

          <br/>
          <br/>

          <div id='your-games-section'>
            <h3>Your games:</h3>
            TODO: Your games. Each game has a link, and shows the Game Type, GameID + Forfeit or Delete button based on if there's an opponent

          </div>

          <br/>
          <br/>

          

          <button onClick={logout}>
            Logout
          </button>
        </>
      )
    } else {
      navigate('/login')
    }
}

export default GamesLobby;
