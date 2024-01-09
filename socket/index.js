const io = require('socket.io')(8800, { // OPEN A THIRD PORT
    cors: {
        origin: "http://localhost:3000" //DO THIS ON THE REACT SERVER, NOT THE API SERVER (8080)
    }
})

let activeUsers = [];
let activeGames = {};


// ========== SOCKET METHODS:==============
io.on("connection", (socket) => {

    // Adding the session user to the list of active users:
    socket.on("add-new-user", (newUserID)=> { //in param
        //if user is not added previously
        if(!activeUsers.some((user) => user.userID === newUserID))
        {
            activeUsers.push({
                userID: newUserID,
                socketID: socket.id,
                gameID: newUserID.gameID //add gameID to params as well.
            })
        }

        //console log the connected users:
        console.log("Connected Users:", activeUsers);
        io.emit('get-users', activeUsers); // send to FE
    })

    // Disconnecting a user from the list of active users:
    socket.on("disconnect", () => {
        activeUsers = activeUsers.filter((user) => user.socketID !== socket.id) //userID fed from socket.id from FE
        console.log("User Disconnected. Remaining Active Users:", activeUsers);
        io.emit('get-users', activeUsers); // send list of active users to the currently activeUsers
    })

    // When a user views a certain game
    socket.on("create-game-room", (gameID) => { //put gameID in the params
        const usersInGame = activeUsers.filter((user) => user.gameID === gameID);

        const game = {
            players: usersInGame
        };

        // Join the game room?
        socket.join(gameID);
        console.log("Game created: ", activeGames[gameID]);
        console.log("All Games: ", activeGames);

    });

    socket.on("place-piece", ({gameID, updatedGame}) => {
        if (activeGames[gameID]) { // check if activeGames[gameID] does not return null
            io.to(gameID).emit("receive-game-update", {gameID, gameState: updatedGame})
            console.log("Placing Piece in Game:", gameID);
            console.log(updatedGame);
        } else {
            console.log("No active game found", gameID);
            console.log("Active Games: ", activeGames);
        }
    })
    

    // MESSAGING METHODS:
    // when user A sends a message to user B, socket finds user B and sends a signal to userB.socket
    // socket.on("send-message", (data) => {
    //     const {receiverID} = data;
    //     const user = activeUsers.find((user) => user.userID === receiverID);
    //     console.log("Sending newMessage from socket to :", receiverID)
    //     console.log("New Message Data: ", data)

    //     if (user) {
    //         io.to(user.socketID).emit("receive-message", data);
    //         console.log("Receiving data from socket to:", receiverID);
    //         console.log("Recieved Data: ", data.body)
    //     }
    // })

    // when user A starts a chat with userB, socket finds user B and sends a signal to userB.socket
    // socket.on("send-new-conversation", (data) => {
    //     const { receiverID } = data;
    //     const user = activeUsers.find((user) => user.userID === receiverID);
    //     console.log("Sending new conversation from socket to :", receiverID)
    //     console.log("New Conversation Data: ", data)

    //     if (user) {
    //         io.to(user.socketID).emit("receive-new-conversation", data);
    //         console.log("Receiving new conversation data from socket to:", receiverID);
    //         console.log("Recieved newConversation Data: ", data.members)
    //     }


    // })

})