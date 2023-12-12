const PASSIVELY_OBSERVE = "passively observe"
const PUNCH_CUBE = "punch cube"
const GIVE_UP_AND_GO_HOME = "give up and go home"

const STATES = {
  GAME_OVER: "game over",
  VICTORY: "victory",
}

//imports the state of the board i.e where all the pieces are,
//  the game state such as player turn, game won
//and action, that is any actions to be taken on the game
const handleAction = (game, action) => {
  let verbFunction = null;
  if (action.verb === PASSIVELY_OBSERVE) {
    verbFunction = passivelyObserve;
  } else if (action.verb === PUNCH_CUBE) {
    verbFunction = punchCube;
  } else if (action.verb === GIVE_UP_AND_GO_HOME) {
    verbFunction = giveUpAndGoHome;
  }
  verbFunction(game, action);
  return game;
};

const passivelyObserve = (game, action) => {};

const punchCube = (game, action) => {
  game.boardState.numberOfCubes = game.boardState.numberOfCubes - 1;
  if (game.boardState.numberOfCubes === 0) {
    // Congrats! You broke all the cubes
    game.progressState = STATES.VICTORY;
  }
};

const giveUpAndGoHome = (game, action) => {
  game.progressState = STATES.GAME_OVER;
};

module.exports = handleAction;
