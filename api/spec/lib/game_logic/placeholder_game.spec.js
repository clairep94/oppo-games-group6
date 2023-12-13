const handleActionRequest = require("../../../lib/game_logic/placeholder_game");

describe("handleActionRequest", () => {
  test("gameState and boardState remain unchanged", () => {
    const result = handleActionRequest({
      progressState: "a game state",
      boardState: { numberOfCubes: 64 } },
      { actor: "id of actor", op: "passively observe" },
    );
    expect(result.game).toEqual({
      progressState: "a game state",
      boardState: { numberOfCubes: 64 },
    });
    expect(result.response.code).toEqual("ok");
  });

  test("gameState remains unchanged and boardState cube count decreases by 1", () => {
    const result = handleActionRequest({
      progressState: "a game state",
      boardState: { numberOfCubes: 64 } },
      { actor: "id of actor", op: "punch cube" },
    );
    expect(result.game).toEqual({
      progressState: "a game state",
      boardState: { numberOfCubes: 63 },
    });
    expect(result.response.code).toEqual("ok");
  });

  test("gameState changes (Game Over) and boardState does not change", () => {
    const result = handleActionRequest({
      progressState: "a game state",
      boardState: { numberOfCubes: 64 } },
      { actor: "id of actor", op: "give up and go home" },
    );
    expect(result.game).toEqual({
      progressState: "game over",
      boardState: { numberOfCubes: 64 },
    });
    expect(result.response.code).toEqual("ok");
  });

  test("when the last cube is broken, the game is won", () => {
    const result = handleActionRequest({
      progressState: "a game state",
      boardState: { numberOfCubes: 1 } },
      { actor: "id of actor", op: "punch cube" },
    );
    expect(result.game).toEqual({
      progressState: "victory",
      boardState: { numberOfCubes: 0 },
    });
    expect(result.response.code).toEqual("ok");
  });

  test("an error is thrown if the provided game state does not exist", () => {
    const tryWithNonexistentState = () => {
      handleActionRequest({
        progressState: "a nonexistent state",
        boardState: { numberOfCubes: 64 } },
        { actor: "id of actor", op: "passively observe" },
      );
    };
    expect(tryWithNonexistentState)
    .toThrow(new Error("State <a nonexistent state> is undefined"));
  });

  //test("an error is thrown if the provided op does not exist", () => {})

  test("get a rejection response if the op isn't available in the current state", () => {
    const gameBeforeRequest = {
      progressState: "game over",
      boardState: { numberOfCubes: 64 }
    };
    const result = handleActionRequest(
      gameBeforeRequest,
      { actor: "id of actor", op: "passively observe" },
    );
    // Check the progress & board states haven't changed
    expect(result.game).toEqual(gameBeforeRequest);
    // Can't passively observe any more once you've given up and gone home!
    expect(result.response.code).toEqual("invalid");
  })

});
