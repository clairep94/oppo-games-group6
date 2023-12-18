import React, { useState, useEffect, useRef, useCallback } from "react";
import getSessionUserID from "../../utility/getSessionUserID";

const STATE_CODES = { // From Rock Paper Scissors game logic code
  AWAITING_HOST: "awaiting-host",
  AWAITING_GAME: "awaiting-game",
  PLAYING_GAME: "playing-game",
  CONCLUDED: "concluded",
};

const HAND_SIGNS = {
  NONE: "none", // i.e. pending
  ROCK: "rock",
  PAPER: "paper",
  SCISSORS: "scissors",
};

const isPlayerThisGame = (gameSnapshot, playerId) => {
  return gameSnapshot.players.map(p => p._id).includes(playerId);
};

const findPlayerIndex = (gameSnapshot, playerId) => {
  const index = gameSnapshot.players.map(p => p._id).indexOf(playerId);
  if (index === -1) { throw new Error(`playerId ${playerId} not participating`); }
  return index;
};

const findPlayerUsername = (gameSnapshot, playerId) => {
  return gameSnapshot.players[findPlayerIndex(gameSnapshot, playerId)].username;
};

const RockPaperScissors = ({ gameId }) => {
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const clientUserId = getSessionUserID(token);
  const pollingTimer = useRef(null);
  const [shouldDoPolling, setShouldDoPolling] = useState(true);
  const [gameMostRecentUpdate, setGameMostRecentUpdate] = useState(null);
  const [gameSnapshot, setGameSnapshot] = useState(null);

  const updateGameSnapshotAndTokenAfterRequest = useCallback((promiseFromFetchCall) => {
    promiseFromFetchCall
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        throw new Error(`Status code ${res.status}`);
      }
    })
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
    })
    .catch(e => {console.log(e); /* Fail silently (for now) */});
  }, [gameMostRecentUpdate]);

  useEffect(() => { // Initial get request
    updateGameSnapshotAndTokenAfterRequest(
      fetch(`/rps/${gameId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })
    );
  }, [gameId, token, updateGameSnapshotAndTokenAfterRequest]);

  useEffect(() => { // Stop polling when game finished
    if (gameSnapshot === null) {
      return; // Game snapshot not loaded yet
    }
    if (gameSnapshot.progressState === STATE_CODES.CONCLUDED) {
      setShouldDoPolling(false);
    }
  }, [gameSnapshot]);

  useEffect(() => { // Handle polling stuff
    const pollingCallback = () => {
      console.log("Polling now");
      updateGameSnapshotAndTokenAfterRequest(
        fetch(`/rps/${gameId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        })
      );
    };
    pollingCallback(); // Initial game data load
    if (shouldDoPolling) { // Every 2 seconds
      pollingTimer.current = setInterval(pollingCallback, 2000);
    } else {
      clearInterval(pollingTimer.current);
    }
    return () => {
      clearInterval(pollingTimer.current);
    };
  }, [
    token, shouldDoPolling, gameMostRecentUpdate, gameSnapshot, gameId,
    updateGameSnapshotAndTokenAfterRequest
  ]);

  const joinGame = () => {
    updateGameSnapshotAndTokenAfterRequest(
      fetch(`/rps/${gameId}/join`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })
    );
  };

  const assignSettings = (settings) => {
    updateGameSnapshotAndTokenAfterRequest(
      fetch(`/rps/${gameId}/setup`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ args: { settings: settings }}),
      })
    );
  };

  const confirmReady = (agreedSettings) => {
    console.log( { args: { settings: agreedSettings }} );
    updateGameSnapshotAndTokenAfterRequest(
      fetch(`/rps/${gameId}/ready`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ args: { settings: agreedSettings }}),
      })
    );
  };

  const throwHandSign = (currentRound, handSign) => {
    updateGameSnapshotAndTokenAfterRequest(
      fetch(`/rps/${gameId}/throw`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ args: { currentRound: currentRound, handSign: handSign }}),
      })
    );
  };

  const resignGame = () => {
    updateGameSnapshotAndTokenAfterRequest(
      fetch(`/rps/${gameId}/resign`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })
    );
  };

  if (gameSnapshot === null) {
    return (
      <div className="rock-paper-scissors">
        <p>Loading Rock Paper Scissors...</p>
      </div>
      );
  }
  return (
    <div className="rock-paper-scissors">
      <p>Hi there!</p>
      <button onClick={() => setShouldDoPolling(false)}>Stop polling</button>
      <button onClick={() => setShouldDoPolling(true)}>Start polling</button>
      <p>Currently polling? {shouldDoPolling ? "Yes" : "No"}</p>

      {/* SECTION 1: AWAITING_HOST */
        gameSnapshot.progressState === STATE_CODES.AWAITING_HOST &&
        <BeforeHostUI props={{ gameSnapshot, clientUserId, joinGame }}/>
      }

      {/* SECTION 2: AWAITING_GAME */
        gameSnapshot.progressState === STATE_CODES.AWAITING_GAME &&
        <BeforeGameUI props={{ gameSnapshot, clientUserId, joinGame, assignSettings, confirmReady }} />
      }

      {/* SECTION 3: PLAYING_GAME */
        gameSnapshot.progressState === STATE_CODES.PLAYING_GAME &&
        <DuringGameUI props={{ gameSnapshot, clientUserId, joinGame, throwHandSign, resignGame }} />
      }

      {/* SECTION 4: CONCLUDED */
        gameSnapshot.progressState === STATE_CODES.CONCLUDED &&
        <AfterGameUI props={{ gameSnapshot, clientUserId }} />
      }

      {/* DEBUG SECTION: Just display the whole game snapshot */}
      <p>{JSON.stringify(gameSnapshot)}</p>
    </div>
  );
};

// Sub-components for rendering specific parts of the UI

const ClientInfo = ({ props }) => {
  const { gameSnapshot, clientUserId } = props;
  return (
    <div className="rock-paper-scissors/client-info">
      <p>Your clientUserId is: {clientUserId}</p>
      <p>Are you a player in this game? {
        isPlayerThisGame(gameSnapshot, clientUserId)
        ? `Yes (player index: ${
            findPlayerIndex(gameSnapshot, clientUserId)
          }, username: ${
            findPlayerUsername(gameSnapshot, clientUserId)
          })`
        : "No"
      }</p>
      <p>Are you this game's host? {gameSnapshot.hostId === clientUserId ? "Yes" : "No"}</p>
    </div>
  );
}

const SettingsUI = ({ props }) => {
  const { gameSnapshot, clientUserId, assignSettings, confirmReady } = props;
  const [settings, setSettings] = useState({
    pointsObjective: gameSnapshot.settings.pointsObjective,
  });
  const clientIsHost = (gameSnapshot.hostId === clientUserId);
  useEffect(() => {
    setSettings(gameSnapshot.settings);
  }, [ gameSnapshot ]);
  //const changePointsObjectiveSetting
  return (
    <div className="rock-paper-scissors/settings-ui">
      <ul>
        <li>
          Points needed to win: {settings.pointsObjective}
          {clientIsHost && <>
            <button onClick={ () => {
              let nextSettings = { ...settings, pointsObjective: 1 };
              console.log(nextSettings);
              setSettings(nextSettings); // (Do this so the UI changes immediately)
              assignSettings(nextSettings);
            }}>Set to 1 point</button>
            <button onClick={ () => {
              let nextSettings = { ...settings, pointsObjective: 3 };
              console.log(nextSettings);
              setSettings(nextSettings);
              assignSettings(nextSettings);
            }}>Set to 3 points</button>
          </>}
        </li>
      </ul>
      { // Show ready button if playing in this game
        gameSnapshot.players.map(p => p._id).includes(clientUserId)
        && <ReadyConfirmer props={{
          settings, confirmReady,
          /*playerIndex: gameSnapshot.players.map(p => p._id).indexOf(clientUserId)*/
        }} />
      }
    </div>
  )
};

const ReadyConfirmer = ({ props }) => {
  const { settings, confirmReady } = props;
  const [showConfirmationQuery, setShowConfirmationQuery] = useState(false);
  const [readiedStatus, setReadiedStatus] = useState(
    {
      hasReadied: false,
      settingsSeen: settings, // Important that the user has had time to see and consider these
    }
  );
  useEffect(() => {
    // Set readied to false and disable confirmation query whenever the settings prop changes value
    // from the value seen by the user (i.e. give them time to read and agree to the new settings)
    // i.e. Don't want the user to click "Confirm" at the last moment and accidentally agree to
    // settings they don't want to play with!
    if (readiedStatus.settingsSeen.pointsObjective !== settings.pointsObjective) {
      // Add more OR comparisons to this conditional if more settings get added
      setReadiedStatus({ hasReadied: false, settingsSeen: settings });
      setShowConfirmationQuery(false);
    }
  }, [settings, readiedStatus]);
  return(
    <div className="rock-paper-scissors/confirm-ready">
      {
        readiedStatus.hasReadied
        ? <p>Please wait for the game to begin. If game settings change, you will be asked to ready again.</p>
        : (
          showConfirmationQuery === true
          ? <>
              <p>Are you OK to play with these settings?</p>
              <button onClick={() => { confirmReady(settings); setReadiedStatus({
                hasReadied: true, settingsSeen: settings
              }); }}>Confirm
              </button>
              <button onClick={() => { setShowConfirmationQuery(false)}}>Cancel</button>
            </>
          : <button onClick={() => setShowConfirmationQuery(true)}>Click when ready to begin</button>
        )
      }
    </div>
  );
};

const BeforeHostUI = ({ props }) => {
  const { gameSnapshot, clientUserId, joinGame } = props;
  return (
    <div className="rock-paper-scissors/before-host-ui">
      <h3>Waiting for host.</h3>
      <ClientInfo props={{ gameSnapshot, clientUserId }} />
      {
        gameSnapshot.players.length < 2
        ? <button onClick={joinGame}>Join Game</button>
        : <p>Game full (2 of 2 players).</p>
      }
    </div>
  );
};

const BeforeGameUI = ({ props }) => {
  const { gameSnapshot, clientUserId, joinGame, assignSettings, confirmReady } = props;
  return (
    <div className="rock-paper-scissors/before-game-ui">
      <h3>Waiting for all players to get ready.</h3>
      <ClientInfo props={{ gameSnapshot, clientUserId }} />
      {
        gameSnapshot.players.length < 2
        ? <button onClick={joinGame}>Join Game</button>
        : <p>Game full (2 of 2 players).</p>
      }
      <SettingsUI props={{ gameSnapshot, clientUserId, assignSettings, confirmReady }}/>
    </div>
  );
};

const DuringGameUI = ({ props }) => {
  const { gameSnapshot, clientUserId, throwHandSign, resignGame } = props;
  const [selectedHandSign, setSelectedHandSign] = useState(HAND_SIGNS.NONE);
  return (
    <div className="rock-paper-scissors/during-game-ui">
      <h3>Now playing Rock Paper Scissors.</h3>
      <ClientInfo props={{ gameSnapshot, clientUserId }} />
      <button onClick={() => setSelectedHandSign(HAND_SIGNS.ROCK)}>Select Rock</button>
      <button onClick={() => setSelectedHandSign(HAND_SIGNS.PAPER)}>Select Paper</button>
      <button onClick={() => setSelectedHandSign(HAND_SIGNS.SCISSORS)}>Select Scissors</button>
      {
        selectedHandSign !== HAND_SIGNS.NONE &&
        <button onClick={() => throwHandSign(gameSnapshot.currentRound, selectedHandSign)}>
          Confirm move: {`${selectedHandSign}`}
        </button>
      }
      <button onClick={resignGame}>Resign the game</button>
    </div>
  );
};

const AfterGameUI = ({ props }) => {
  const { gameSnapshot, clientUserId } = props;
  return (
    <div className="rock-paper-scissors/after-game-ui">
      <h3>Finished playing Rock Paper Scissors.</h3>
      <ClientInfo props={{ gameSnapshot, clientUserId }} />
      <p>Game conclusion type: {gameSnapshot.conclusionType}</p>
      <p>Game results: {JSON.stringify(gameSnapshot.playerResults)}</p>
    </div>
  );
};



export default RockPaperScissors;
