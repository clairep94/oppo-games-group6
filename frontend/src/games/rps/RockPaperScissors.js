import React, { useState, useEffect, useRef } from "react";

const RockPaperScissors = ({ gameId }) => {
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const pollingTimer = useRef(null);
  const [shouldDoPolling, setShouldDoPolling] = useState(true);
  const [gameMostRecentUpdate, setGameMostRecentUpdate] = useState(null);
  const [gameSnapshot, setGameSnapshot] = useState(null);
  useEffect(() => {
    // Initial load
    const pollingCallback = () => {
      console.log("Polling now");
      fetch(`/rps/${gameId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })
      .then(res => res.json())
      .then(async data => {
        window.localStorage.setItem("token", data.token);
        setToken(window.localStorage.getItem("token"));
        if (
          (gameMostRecentUpdate === null) ||
          (gameMostRecentUpdate < data.game.updatedAt)
        ) {
          setGameMostRecentUpdate(data.game.updatedAt);
          setGameSnapshot(data.game);
        } // Else do nothing as snapshot recieved out-of-order
      });
    };
    pollingCallback(); // Initial load
    if (shouldDoPolling) { // Every 2 seconds
      pollingTimer.current = setInterval(pollingCallback, 2000);
    } else {
      clearInterval(pollingTimer.current);
    }
    return () => {
      clearInterval(pollingTimer.current);
    };
  }, [token, shouldDoPolling, gameMostRecentUpdate, gameSnapshot, gameId]);

  const joinGame = () => {
    fetch(`/rps/${gameId}/join`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
  };

  return (
    <div className="rock-paper-scissors">
      <p>Hi there!</p>
      {/* SECTION 1: AWAITING_HOST | AWAITING_GAME */}
      <button onClick={joinGame}>Join Game</button>
      <p>{JSON.stringify(gameSnapshot)}</p>
    </div>
  );
};

export default RockPaperScissors;
