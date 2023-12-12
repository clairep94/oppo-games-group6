import React, { useEffect, useState } from 'react';
// import Post from '../post/Post'

const GamesLobby = ({ navigate }) => {
  // const [posts, setPosts] = useState([]); //will change to available_games, setAvailableGames
  const [token, setToken] = useState(window.localStorage.getItem("token"));

  //TODO: Update when we have the ability to GET all available_games from "/games"
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
  
    if(token) {
      return(
        <>
          <h2>Games Lobby</h2>
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
