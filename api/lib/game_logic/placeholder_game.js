//imports the state of the board i.e where all the pieces are,
//  the game state such as player turn, game won
//and action, that is any actions to be taken on the game
const handleAction = (gameState, boardState, action) => {
  if (action.verb === "passively observe"){
    return {gameState:gameState, boardState:boardState} 
     //return { gameState: gameState, boardState: boardState }; 
     //does nothing but return these variables
  } else if (action.verb === "punch cube"){
      boardState.numberOfCubes = boardState.numberOfCubes - 1
    return {gameState:gameState, boardState:boardState}
  }
};

module.exports = handleAction;
