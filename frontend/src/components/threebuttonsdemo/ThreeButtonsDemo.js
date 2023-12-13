import React, { useEffect, useState, useRef } from 'react';




const ThreeButtonsDemo = ({ navigate }) => {
  const [currentMask, setCurrentMask] = useState("red");
  const sampleJSONMessage = {recipient: "Example recipient", message: "hi there"};
  const [inbox, setInbox] = useState([JSON.stringify(sampleJSONMessage)]);
  const mailTimer = useRef(null);
  const [shouldCheckMail, setShouldCheckMail] = useState(true);

  useEffect(() => {
    const mailCheckerCallback = () => {
      // Fetch request will go here 
      console.log("I'd check it if I could");
    };
    const startChecking = () => {
      mailTimer.current = setInterval(mailCheckerCallback, 2000);
    };
    const stopChecking = () => {
      clearInterval(mailTimer.current);
    }
    if (shouldCheckMail) {
      startChecking();
    } else {
      stopChecking();
    }
    return () => {
      stopChecking();
    }
  }, [shouldCheckMail]);

  const newGamePlease = () => {};
  const joinGamePlease = () => {};

  const checkOftenPlease = () => {
    setShouldCheckMail(true);
  };
  const checkNeverPlease = () => {
    setShouldCheckMail(false);
  };

  const winPlease = () => {};
  const passPlease = () => {};
  const resignPlease = () => {};

  const wearRedMask = () => {
    setCurrentMask("red");
  };
  const wearBlueMask = () => {
    setCurrentMask("blue");
  };
  return(
    <>
      <h2>Three Buttons Game Demo</h2>
      <button onClick={newGamePlease}>Click to start and join a new game</button>
      <button onClick={joinGamePlease}>Click to join the new game</button>
      <br />
      <button onClick={checkOftenPlease}>Click to start checking mail every 2 seconds</button>
      <button onClick={checkNeverPlease}>Click to stop checking your mail for now</button>
      <br />
      <button onClick={winPlease}>Click to win on your turn</button>
      <button onClick={passPlease}>Click to skip your turn</button>
      <button onClick={resignPlease}>Click to resign at any time</button>
      <br />
      <button onClick={wearRedMask}>Play as player 1 {"(red)"}</button>
      <button onClick={wearBlueMask}>Play as player 2 {"(blue)"}</button>
      <p>Currently playing as: {currentMask}</p>
      <p><u>Messages inbox</u></p>
      {inbox.map(
        (message) => <p>{message}</p>
      )}
    </>
  )
}

export default ThreeButtonsDemo;
