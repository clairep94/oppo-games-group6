import landingBg from "../../assets/landing_game_console.png"

const Landing = ({ navigate }) => {

    const basicFont = "text-white text-lg font-extralight tracking-widest text-wrap"
    const bgGradPur = "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600 "
    // RGB Colours
    //linear-gradient(to right bottom, rgb(17, 24, 39), rgb(88, 28, 135), rgb(124, 58, 237))

    return (
        <>
     {/* comment  */}

    <div className={bgGradPur}>

    <p className="text-white">this is a sample text</p>

    <div>
        <h3 className="text-xl text-white font-semibold tracking-wider">ONLINE MULTIPLAYER GAMING</h3>
        <h1 className="text-6xl text-white font-extrabold">OPPO GAMES</h1>
        <h2 className={basicFont}>Welcome to Oppo Games. An online platform to participate in retro, multiplayer games in live time. Join a game, chat with your opponent and have fun!</h2>
        
        <button>
            <div>
                <img src="#"></img>
                <p>TIC TAC TOE</p>
            </div>
        </button>

        <button>
            <div>
                <img src="#"></img>
                <p>BATTLESHIPS</p>
            </div>
        </button>
    
    </div>

    <img src={landingBg} 
    alt="game console" 
    ></img>

    </div>
    
    </>
    );
};

export default Landing;