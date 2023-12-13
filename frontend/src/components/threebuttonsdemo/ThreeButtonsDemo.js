import React, { useEffect, useState } from 'react';

const ThreeButtonsDemo = ({ navigate }) => {
  const [currentMask, setCurrentMask] = useState("red");
  const sampleJSONMessage = {recipient: "Example recipient", message: "hi there"};
  const [inbox, setInbox] = useState([JSON.stringify(sampleJSONMessage)]);

  useEffect(() => {

  });

  const newGamePlease = () => {};
  const joinGamePlease = () => {};

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
