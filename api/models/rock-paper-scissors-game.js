

// - Schema:
//     - **First needed for AWAITING_HOST**
//         - `_id` auto-assigned on game creation
//         - `title: String` with `"Rock Paper Scissors"`
//         - `createdAt: Date` using `Date.now()`
//         - `players: [UserId]` with `[]`
//         - `updatedAt: Date` with `createdAt`
//         - `actionLog: [Action]` with `[]`
//         - `progressState: String` with `AWAITING_HOST`
//     - **First needed for AWAITING_GAME**
//         - `hostId: UserId` with UserId of host
//         - `settings: Object` with default settings; properties:
//             - `gameLength: Number` with `1`
//         - `isReady: [Boolean]` with `[false]`
//     - **First needed for PLAYING_GAME**
//         - `signsThrown: [[String]]` with `[["none", "none"]]`
//             - *This is (static) private information! While the game is in progress, don't show the other client what was picked, instead responding to client 1 with e.g. [["scissors", "rock"], ["paper", null]] if client 1 picked paper in round 2 and is waiting for client 2's pick.*
//         - `currentRound` with 1
//         - `scores: [Number]` with `[0, 0]`
//     - **First needed for CONCLUDED**
//         - `concludedAt: Date` with `Date.now()` on conclusion
//         - `conclusionType: String` with `"normal"` or `"by-resignation"`
//         - `playerResults: [Object]` with description of results; properties:
//             - `outcome: String` with `"won"`, `"lost"`, or `"resigned"`
//             - `finalScore: Number` with `0` or `1` for a best-of-1 game, up to `2` for a best-of-3 game
