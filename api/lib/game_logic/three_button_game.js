const OPS = {
  // "op" is short for "operation"
  JOIN_GAME: "join game",
  WIN: "win",
  PASS: "pass",
  RESIGN: "resign",
};

const validateRequestedOperation = (actionRequest) => {
  if (!Object.values(OPS).includes(actionRequest.op)) {
    throw new Error(`Operation <${actionRequest.op}> is undefined`);
  }
};

const STATES = {
  // Game progress states
  WAITING_FOR_PLAYERS: "waiting for players",
  // INITIALIZING: "initializing",
  // WAITING_FOR_OPPONENT: "waiting for opponent",
  PLAYER_1_TURN: "player 1 turn",
  PLAYER_2_TURN: "player 2 turn",
  GAME_OVER: "game over",
};

const validateProgressState = (game) => {
  if (!Object.values(STATES).includes(game.progressState)) {
    throw new Error(`State <${game.progressState}> is undefined`);
  }
};

const RESPONSE_CODES = {
  OK: "ok",
  INVALID: "invalid",
  AUTH_ERROR: "auth error",
};

const MESSAGES = {
  GAME_JOINED: "game joined",
  VICTORY: "victory",
  DEFEAT: "defeat",
  YOU_RESIGNED: "you resigned",
  IT_IS_YOUR_TURN: "it is your turn",
  OPPONENT_HAS_FIRST_TURN: "opponent has first turn",
};

const PLAYERS = {
  ONE: "one",
  TWO: "two",
};

const validateGameParticipant = (game, actionRequest) => {
  if (game.participant.one === actionRequest.actor) {
    //return PLAYERS.ONE;
  } else if (game.participant.two === actionRequest.actor) {
    //return PLAYERS.TWO;
  } else {
    // Check if there is space in the game and the player is trying to join
    if ((game.playersJoined < 2) && (actionRequest.op === OPS.JOIN_GAME)) {
      // Let them through
    } else {
      throw new Error(`Player <ID: ${actionRequest.actor}> is not a participant`);
    }
  }
};

const handleActionRequest = (game, actionRequest) => {
  try {
    validateGameParticipant(game, actionRequest);
  } catch (e) {
    return { game: game, response: { code: RESPONSE_CODES.AUTH_ERROR }};
  }
  /*actionRequest.playerLabel = playerLabel;*/
  validateProgressState(game);
  validateRequestedOperation(actionRequest);
  // Validated, but not necessarily verified!
  return handleValidatedAction(game, actionRequest);
};

const handleValidatedAction = (game, action) => {
  const opFunction = decodeOp(action);
  try {
    // This will usually have a side effect of modifying `game`
    opFunction(game, action);
  } catch (e) {
    return { game: game, response: { code: RESPONSE_CODES.INVALID }};
  }
  return { game: game, response: { code: RESPONSE_CODES.OK }};
};

const decodeOp = (action) => {
  if (action.op === OPS.JOIN_GAME) {
    return doJoinGame;
  } else if (action.op === OPS.WIN) {
    return doWin;
  } else if (action.op === OPS.PASS) {
    return doPass;
  } else if (action.op === OPS.RESIGN) {
    return doResign;
  }
};

const enqueueMessage = (game, player, message) => {
  let recipient = null;
  if (player === PLAYERS.ONE) {
    recipient = game.participant.one;
  } else if (player === PLAYERS.TWO) {
    recipient = game.participant.two;
  }
  game.queuedMessages.push({
    recipient: recipient,
    message: message,
  });
};

const doJoinGame = (game, action) => {
  if (game.progressState === STATES.WAITING_FOR_PLAYERS) {
    let newPlayerLabel = null;
    if (game.playersJoined === 0) {
      game.participant.one = action.actor;
      newPlayerLabel = PLAYERS.ONE;
      game.playersJoined = 1;
    } else if (game.playersJoined === 1) {
      if (action.actor === game.participant.one) {
        throw new Error("You can't join a game you're already in");
      }
      game.participant.two = action.actor;
      newPlayerLabel = PLAYERS.TWO;
      game.playersJoined = 2;
    } else {
      throw new Error("Game is already full - state logic is wrong!!!");
    }
    enqueueMessage(game, newPlayerLabel, MESSAGES.GAME_JOINED);
    if (game.playersJoined === 2) {
      randomlySelectFirstPlayerAndBeginGame();
    }
  } else {
    throw new Error("Game has already begun so can't be joined");
  }
};

const randomlySelectFirstPlayerAndBeginGame = () => {
  if (Math.random() < 0.5) {
    game.progressState = STATES.PLAYER_1_TURN;
    enqueueMessage(game, PLAYERS.ONE, MESSAGES.IT_IS_YOUR_TURN);
    enqueueMessage(game, PLAYERS.TWO, MESSAGES.OPPONENT_HAS_FIRST_TURN);
  } else {
    game.progressState = STATES.PLAYER_2_TURN;
    enqueueMessage(game, PLAYERS.TWO, MESSAGES.IT_IS_YOUR_TURN);
    enqueueMessage(game, PLAYERS.ONE, MESSAGES.OPPONENT_HAS_FIRST_TURN);
  }
};

const doWin = (game, action) => {
  // You are only able to press the win button on *your* turns.
  if (game.progressState === STATES.WAITING_FOR_PLAYERS) {
    throw new Error("Invalid action - game hasn't started yet");
  } else if (game.progressState === STATES.PLAYER_1_TURN) {
    if (game.participant.one === action.actor) {
      // Congratulations, Player 1!
      doEndGameTasks(game, PLAYERS.ONE, PLAYERS.TWO);
    } else {
      throw new Error("Can't win outside of your turn");
    }
  } else if (game.progressState === STATES.PLAYER_2_TURN) {
    if (game.participant.two === action.actor) {
      // Congratulations, Player 2!
      doEndGameTasks(game, PLAYERS.TWO, PLAYERS.ONE);
    } else {
      throw new Error("Can't win outside of your turn");
    }
  } else if (game.progressState === STATES.GAME_OVER) {
    throw new Error("Someone has already won this game");
  }
};

const doEndGameTasks = (game, winner, loser) => {
  enqueueMessage(game, winner, MESSAGES.VICTORY);
  enqueueMessage(game, loser, MESSAGES.DEFEAT);
  game.progressState = STATES.GAME_OVER;
};

const doPass = (game, action) => {
  // You are only able to press the pass button on *your* turns.
  if (game.progressState === STATES.WAITING_FOR_PLAYERS) {
    throw new Error("Invalid action - game hasn't started yet");
  } else if (game.progressState === STATES.PLAYER_1_TURN) {
    if (game.participant.one === action.actor) {
      // Player 1 chooses to pass. Now it's Player 2's turn.
      game.enqueueMessage(game, PLAYERS.TWO, MESSAGES.IT_IS_YOUR_TURN);
      game.progressState = STATES.PLAYER_2_TURN;
    } else {
      throw new Error("Can't pass outside of your turn");
    }
  } else if (game.progressState === STATES.PLAYER_2_TURN) {
    if (game.participant.two === action.actor) {
      // Player 2 chooses to pass. Now it's Player 1's turn.
      enqueueMessage(game, PLAYERS.ONE, MESSAGES.IT_IS_YOUR_TURN);
      game.progressState = STATES.PLAYER_1_TURN;
    } else {
      throw new Error("Can't pass outside of your turn");
    }
  } else if (game.progressState === STATES.GAME_OVER) {
    throw new Error("This game is already over");
  }
};

const doResign = (game, action) => {
  // Unlike winning and passing, you can resign at any point during the game.
  if (game.progressState === STATES.WAITING_FOR_PLAYERS) {
    throw new Error("Resign? The game hasn't even started yet");
  } else if (
    (game.progressState === STATES.PLAYER_1_TURN) ||
    (game.progressState === STATES.PLAYER_2_TURN)) {
      if (game.participant.one === action.actor) {
        // Player 1 resigns.
        enqueueMessage(game, PLAYERS.ONE, MESSAGES.YOU_RESIGNED);
        enqueueMessage(game, PLAYERS.TWO, MESSAGES.VICTORY);
        game.progressState = STATES.GAME_OVER;
      } else if (game.participant.two === action.actor) {
        // Player 2 resigns.
        enqueueMessage(game, PLAYERS.TWO, MESSAGES.YOU_RESIGNED);
        enqueueMessage(game, PLAYERS.ONE, MESSAGES.VICTORY);
        game.progressState = STATES.GAME_OVER;
    }
  } else if (game.progressState = STATES.GAME_OVER) {
    throw new Error("No need to resign, the game's already over");
  }
};

module.exports = handleActionRequest;
