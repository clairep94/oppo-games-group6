const handleAction = require("../../../lib/game_logic/placeholder_game");

describe("handleAction", () => {
  test("gameState and boardState remain unchanged", () => {
    const result = handleAction(
      "my game state",
      { numberOfCubes: 64 },
      { actor: "id of actor", verb: "passively observe" },
    );
    expect(result).toEqual({
      gameState: "my game state",
      boardState: { numberOfCubes: 64 },
    });
  });


  test("gameState remains unchanged and boardState cube count decreases by 1", () => {
    const result = handleAction(
      "my game state",
      { numberOfCubes: 64 },
      { actor: "id of actor", verb: "punch cube" },
    );
    expect(result).toEqual({
      gameState: "my game state",
      boardState: { numberOfCubes: 63 },
    });
  });

  test("gamestate changes (Game Over) and boardState does not change", () => {
    const result = handleAction(
      "my game state",
      { numberOfCubes: 64 },
      {actor: "id of actor", verb: "give up and go home" },
    );
    expect(result).toEqual({
      gameState: "game over",
      boardState: { numberOfCubes: 64 },
    });
  });

});
