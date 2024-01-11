const endpoint = '/messages';

const addMessage = async (newMessagePayload) => {
  //message payload
  //gameID: req.body.gameID,
  //author: req.body.authorID,
  //body: req.body.body

    try {
        const response = await fetch(`${endpoint}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMessagePayload)
        });
        const newMessageData = await response.json();
        return newMessageData;
    } catch (error) {
        console.error("Messagesapi.addMessage:", error);
        throw error;
    }
}

const fetchMessages = async (gameID) => {
    try {
    const response = await fetch(`${endpoint}/${gameID}`, {
        headers: {

        },
        });
        const messagesData = await response.json();
        return messagesData;
        
    } catch (error) {
        console.error("MessagesAPI.fetchMessages:", error);
        throw error;
    }

}



export {addMessage,fetchMessages }