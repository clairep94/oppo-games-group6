const handleAction = require("../../../lib/game_logic/placeholder_game");

describe("handleAction", () => {
  test("tests gamestate and boardstate remain unchanged", () => {
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


test("tests gamestate remains unchanged and boardstate cubes decreases by 1", () => {
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
});