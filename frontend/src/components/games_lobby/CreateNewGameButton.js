const NewGameButton = (props) => {
    const token = props.token
    const navigate = props.navigate
    const gameTitle = props.gameTitle
    const gameEndpoint = props.gameEndpoint

    const createNewGame = async (event) => {
        event.preventDefault()
    
        try {
            const response = await fetch(`/${gameEndpoint}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({}),
            });
        
            if (response.status === 201) {
            const data = await response.json();
            const gameID = data.game._id;
            navigate(`/${gameEndpoint}/${gameID}`);
            } else {
            navigate('/login');
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
            className={`create-${gameEndpoint}-game-button`}
            id={`create-${gameEndpoint}-game-button`}
            style={{width: "200px", height: "50px"}}
        >
            {`New ${gameTitle} game`}
        </button>
        )
    
        };

export default NewGameButton;