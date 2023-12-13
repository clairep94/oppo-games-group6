import React, { useState } from 'react';

const ThreeButtonsDemo = ({ navigate }) => {
  const winPlease = () => {};
  const passPlease = () => {};
  const resignPlease = () => {};
  const wearRedMask = () => {};
  const wearBlueMask = () => {};
  return(
    <>
      <h2>Three Buttons Game Demo</h2>
      <button onClick={winPlease}>Click to win on your turn</button>
      <button onClick={passPlease}>Click to skip your turn</button>
      <button onClick={resignPlease}>Click to resign at any time</button>
      <button onClick={wearRedMask}>Play as player 1 {"(red)"}</button>
      <button onClick={wearBlueMask}>Play as player 2 {"(blue)"}</button>
    </>
  )
}

export default ThreeButtonsDemo;
