const PASSIVELY_OBSERVE = "passively observe";
const PUNCH_CUBE = "punch cube";
const GIVE_UP_AND_GO_HOME = "give up and go home";

const STATES = {
  A_GAME_STATE: "a game state",
  GAME_OVER: "game over",
  VICTORY: "victory",
  // Note that there is no state with value "a nonexistent state".
};

const hasValidProgressState = (game) =>
  Object.values(STATES).includes(game.progressState);

const RESPONSE_CODES = {
  OK: "ok",
  INVALID: "invalid",
  /*ERROR: "error",  <-- Probably not needed */
};

//imports the state of the board i.e where all the pieces are,
//  the game state such as player turn, game won
//and action, that is any actions to be taken on the game
const handleActionRequest = (game, actionRequest) => {
  if (!hasValidProgressState(game)) {
    throw new Error(`State <${game.progressState}> is undefined`);
  }
  let opFunction = null;
  if (actionRequest.op === PASSIVELY_OBSERVE) {
    opFunction = passivelyObserve;
  } else if (actionRequest.op === PUNCH_CUBE) {
    opFunction = punchCube;
  } else if (actionRequest.op === GIVE_UP_AND_GO_HOME) {
    opFunction = giveUpAndGoHome;
  }
  // Note: `opFunction` often has the side effect of modifying `game`
  // It will also throw an error if the request is for an invalid state transition
  try {
    opFunction(game, actionRequest);
  } catch (e) {
    return {
      game: game,
      response: {
        code: RESPONSE_CODES.INVALID /*, errorMessage: e.message*/,
      },
    };
  }
  return { game: game, response: { code: RESPONSE_CODES.OK } };
};

const passivelyObserve = (game, actionRequest) => {
  // This may be in want of State-Transition Transpose refactoring at some point :)
  if (game.progressState === STATES.GAME_OVER) {
    throw new Error("Invalid state transition requested");
  } else {
    // do nothing
  }
};

const punchCube = (game, actionRequest) => {
  game.boardState.numberOfCubes = game.boardState.numberOfCubes - 1;
  if (game.boardState.numberOfCubes === 0) {
    // Congrats! You broke all the cubes. The day is yours
    game.progressState = STATES.VICTORY;
  }
};

const giveUpAndGoHome = (game, actionRequest) => {
  game.progressState = STATES.GAME_OVER;
};

module.exports = handleActionRequest;
