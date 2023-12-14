import React, { useState, useEffect } from "react";
import ThreeButtonsGame from "../../games/threebuttonsgame/ThreeButtonsGame";
import { useParams } from 'react-router-dom';

// Currently, GamePage is only able to display ThreeButtonsGame.

// This component should eventually be accessible at /<title of game>/<game id>
// for all game titles

const GamePage = ({ navigate, gameTitle }) => {
  // Parameter should be ID of game
  const { gameId } = useParams();
  const [token, setToken] = useState(window.localStorage.getItem("token"));

  // Ensure game page only available when logged in
  useEffect(() => {
    if (token) {
      // TODO: figure out if anything needs to be done here
    } else {
      navigate("/login");  // Redirect to login screen
    }
  }, [token, navigate]);

  // Button functions. These should be removed later once a navbar takes care of it
  const logout = () => {
    window.localStorage.removeItem("token");
    setToken(null); // this should make useEffect log you out immediately
  };
  const backToLobby = () => {
    navigate("/lobby");
  };

  // For now: only offer ThreeButtonsGame or an error page

  if (gameTitle === "three-buttons-game") {
    return (
      <>
        {/* TODO: Replace this with a navbar component with ARIA labels etc */}
        <div className="temporary-psuedo-navbar">
          <button onClick={logout}>Log out</button>
          <button onClick={backToLobby}>Back to Lobby</button>
        </div>
        <ThreeButtonsGame gameId={ gameId }/>
      </>
    );
  } else {
    return (
      <>
        <p>Oops! GamePage doesn't recognise that game title yet.</p>
      </>
    );
  }
};

export default GamePage;