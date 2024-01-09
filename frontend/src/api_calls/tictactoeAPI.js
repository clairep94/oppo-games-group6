const endpoint = '/tictactoe';

const newGame = async (newGamePayload) => {
    // payload:
    // playerOne: req.body.playerOne,
    // playerTwo: req.body.playerTwo 

    try {
        const response = await fetch(`${endpoint}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newGamePayload)
        });
        const newGameData = await response.json();
        return newGameData;
    } catch (error) {
        console.error("TictactoeAPI.newGame:", error);
        throw error;
    }
}

const findGame = async (token, id) => {
    try {
    const response = await fetch(`${endpoint}/${id}`, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
        });
        const gameData = await response.json();
        return gameData;
        
    } catch (error) {
        console.error("TictactoeAPI.findUser:", error);
        throw error;
    }

}

const allGames = async (token) => {
    try {
        const response = await fetch(`${endpoint}`, {
            headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        const gameData = await response.json();
        console.log(gameData)
        return gameData;
    } catch (error) {
        console.error("TictactoeAPI.allUsers:", error);
        throw error;
    }
}

const placePiece = async (token, id, movePayload) => {
    // Payload = {row: row, col: col}
    try {
        const response = await fetch(`${endpoint}/${id}/place_piece`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movePayload)
        });
        const gameData = await response.json();
        return gameData;
    } catch (error) {
        console.error("TictactoeAPI.placePiece:", error);
        throw error;
    }
}

const forfeitGame = async (token, id) => {
    try {
        const response = await fetch(`${endpoint}/${id}/forfeit`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const gameData = await response.json();
        return gameData;
    } catch (error) {
        console.error("TictactoeAPI.forfeitGame:", error);
        throw error;
    }
}

export { newGame, findGame, allGames, placePiece, forfeitGame }