import { newGame } from "../../api_calls/tictactoeAPI";

const NewGameButton = (props) => {
    const token = props.token
    const navigate = props.navigate
    const gameTitle = props.gameTitle
    const gameEndpoint = props.gameEndpoint
    const sessionUserID = props.sessionUserID

    const createNewGame = async (event) => {
        event.preventDefault()
        // ATTENTION: THIS IS HARDCODED. CHANGE PLAYER TWO TO ONE OF YOUR EXISTING USERS
        // TODO change this after the Game model is created -> manages host, members, awaiting players...
        const newGamePayload = {
            playerOne: sessionUserID, 
            playerTwo: "65805cfc33d528c09050f9d6"
        }

        try {
            const response = await fetch(`/${gameEndpoint}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newGamePayload),
            });
        
            if (response.status === 201) {
            const data = await response.json();
            const gameID = data.game._id;
            navigate(`/${gameEndpoint}/${gameID}`);
            } else {
            console.log("error creating game")
            // navigate('/login');
            }
        } catch (error) {
            console.error(`Error creating new ${gameTitle} game:`, error);
            navigate('/login');
        }
        };
    
    
        return (
        <button
            aria-label={`Create ${gameTitle} game button`}
            onClick={createNewGame}
            className={` bg-gray-500/50 rounded-lg mb-5 p-5 w-[15rem]`}
            id={`create-${gameEndpoint}-game-button`}
        >
            {`New ${gameTitle} game`}
        </button>
        )
    
        };

export default NewGameButton;