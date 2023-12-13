const handleAction = require("../../../lib/game_logic/placeholder_game");

describe("handleAction", () => {
  test("gameState and boardState remain unchanged", () => {
    const result = handleAction({
      progressState: "a game state",
      boardState: { numberOfCubes: 64 } },
      { actor: "id of actor", op: "passively observe" },
    );
    expect(result).toEqual({
      progressState: "a game state",
      boardState: { numberOfCubes: 64 },
    });
  });

  test("gameState remains unchanged and boardState cube count decreases by 1", () => {
    const result = handleAction({
      progressState: "a game state",
      boardState: { numberOfCubes: 64 } },
      { actor: "id of actor", op: "punch cube" },
    );
    expect(result).toEqual({
      progressState: "a game state",
      boardState: { numberOfCubes: 63 },
    });
  });

  test("gameState changes (Game Over) and boardState does not change", () => {
    const result = handleAction({
      progressState: "a game state",
      boardState: { numberOfCubes: 64 } },
      { actor: "id of actor", op: "give up and go home" },
    );
    expect(result).toEqual({
      progressState: "game over",
      boardState: { numberOfCubes: 64 },
    });
  });

  test("when the last cube is broken, the game is won", () => {
    const result = handleAction({
      progressState: "a game state",
      boardState: { numberOfCubes: 1 } },
      { actor: "id of actor", op: "punch cube" },
    );
    expect(result).toEqual({
      progressState: "victory",
      boardState: { numberOfCubes: 0 },
    });
  });

  test("an error is thrown if the provided game state does not exist", () => {
    const tryWithNonexistentState = () => {
      handleAction({
        progressState: "a nonexistent state",
        boardState: { numberOfCubes: 64 } },
        { actor: "id of actor", op: "passively observe" },
      );
    };
    expect(tryWithNonexistentState)
    .toThrow(new Error("State <a nonexistent state> is undefined"));
  });

});
