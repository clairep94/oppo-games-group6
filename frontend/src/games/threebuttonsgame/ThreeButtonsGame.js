import React, { useEffect, useState, useRef } from 'react';

// The interface page should pass the gameId as a prop to this component.
// It should get the gameId the `useParams` method of `react-router-dom`.
const ThreeButtonsGame = ({ gameId }) => {
  //Stuff for polling and message processing
  const pollingTimer = useRef(null);
  const [shouldDoPolling, setShouldDoPolling] = useState(true);

  // Auth
  const [token, setToken] = useState(window.localStorage.getItem("token"));

  // Game info
  const [game, setGame] = useState(null);

  useEffect(() => {
    const pollingCallback = () => {
      console.log("Polling now");
      fetch(`/three-buttons-game/${gameId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        //body: JSON.stringify({ clientWouldLikeTo: "get some data" }),
      })
      .then(res => res.json())
      .then(async data => {
        // data should have properties: data.token, data.<info client wants>
        window.localStorage.setItem("token", data.token);
        setToken(window.localStorage.getItem("token"));
        setGame(data.game);
      });
    };
    if (shouldDoPolling) {
      // Poll every 2 seconds
      pollingTimer.current = setInterval(pollingCallback, 2000);
    } else {
      clearInterval(pollingTimer.current);
    }
    return () => {
      clearInterval(pollingTimer.current);
    };
  }, [token, gameId, shouldDoPolling]);

  // Functions to be called from inside the component
  // (e.g. via buttons)
  const startPolling = () => {
    console.log("Polling mode enabled");
    setShouldDoPolling(true);
  };
  const stopPolling = () => {
    console.log("Polling mode disabled");
    setShouldDoPolling(false);
  };

  return(
    <>
      <h2>Three Buttons Game</h2>
    </>
  );
};

export default ThreeButtonsGame;
