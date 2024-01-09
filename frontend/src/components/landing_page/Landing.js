import landingBg from "../../assets/landing_game_console.png"

const Landing = ({ navigate }) => {

    const basicFont = "pt-3 text-white text-lg font-extralight tracking-widest text-wrap"
    const bgGradPur = "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600 "
    // RGB Colours
    //linear-gradient(to right bottom, rgb(17, 24, 39), rgb(88, 28, 135), rgb(124, 58, 237))

    return (
        <>
     {/* comment  */}

    <div className={bgGradPur}>
    <div class="container mx-auto p-9">
        <div class="flex justify-end">
        <div class="text-left w-3/5 pr-4">
            
        <div className="flex flex-col h-dvh justify-center">
        <h3 className="text-xl text-white font-semibold tracking-wider">ONLINE MULTIPLAYER GAMING</h3>
        <h1 className="pt-3 text-8xl text-white font-extrabold">OPPO GAMES</h1>
        <h2 className={basicFont}>Welcome to Oppo Games. An online platform to participate in retro, multiplayer games in live time. Join a game, chat with your opponent and have fun!</h2>
        
        <div className="pt-6">
        <button className="w-2/5 bg-pink-500 text-xl text-white font-semibold rounded-lg py-2 px-4 hover:bg-pink-600 focus:outline-none focus:shadow-outline-pink active:bg-pink-700">
        START PLAYING 
        </button>
        </div>

            </div>
        </div>

        <div class="w-2/5 min-h-screen flex flex-col justify-center">
            <img 
                src={landingBg} 
                alt="game console" 
                width="700px"
                ></img>
        </div>
        </div>
    </div>
    </div>

    </>
    );
};

export default Landing;



