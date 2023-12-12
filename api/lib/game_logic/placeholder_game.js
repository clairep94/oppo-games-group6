//imports the state of the board i.e where all the pieces are,
//  the game state such as player turn, game won
//and action, that is any actions to be taken on the game
const handleAction = (gameState, boardState, action) => {
  if (action.verb === "passively observe") {
    const verbFunction = passivelyObserve;
    gameState = verbFunction(gameState, boardState, action);
    return {
      gameState: gameState,
      boardState: boardState,
    };
    //return { gameState: gameState, boardState: boardState };
    //does nothing but return these variables
  } else if (action.verb === "punch cube") {
    const verbFunction = punchCube;
    gameState = verbFunction(gameState, boardState, action);
    //boardState.numberOfCubes = boardState.numberOfCubes - 1;
    return {
      gameState: gameState,
      boardState: boardState,
    };
  } else if (action.verb === "give up and go home") {
    const verbFunction = giveUpAndGoHome;
    gameState = verbFunction(gameState, boardState, action);
    return {
      gameState: gameState,
      boardState: boardState,
    };
  }
};

const passivelyObserve = (gameState, boardState, action) => {
  return gameState;
  // ^ Maybe this (having to return gameState) can be avoided by wrapping
  // the gameState in an object? i.e.
  // old: gameState: "something"; new: gameState: { id: "something" }
  // Another advantage of this method is that it lets you encode additional
  // details within the game state; for instance, the ending timestamp of a game
  // (only known once the game has ended) could be stored in the "game over" state.
};

const punchCube = (gameState, boardState, action) => {
  boardState.numberOfCubes = boardState.numberOfCubes - 1;
  return gameState;
}

const giveUpAndGoHome = (gameState, boardState, action) => {
  return "game over";
}

module.exports = handleAction;
