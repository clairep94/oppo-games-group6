const handlelogic = require("../../../lib/game_logic/placeholder_game");

describe("handleLogic", () => {
    test("tests gamestate and boardstate remain unchanged", () => {
        const result = handlelogic ("my game state", {number_of_cubes:64}, {actor:"id of actor", verb:"passively observe"})
        expect (result).toEqual(
            {gamestate:"my game state", boardstate:{number_of_cubes:64},}
        ) 
    })
})