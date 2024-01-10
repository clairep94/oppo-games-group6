import landingBg from "../../assets/dual-console-image-white.png"
import gameCardBattle from "../../assets/BS2.jpg"
import gameCardTTT from "../../assets/TTT.jpg"
import gameCardRPS from "../../assets/yellow-green-low-poly-landscape-1th24g6bt64mgokg.jpg"
import MiniNavBar from "../navbar/MiniNavBar";

const Landing = ({ navigate }) => {

    const basicFont = "pt-3 text-white text-lg font-medium tracking-wide text-wrap"
    const bgGradient = "bg-gradient-to-br from-emerald-400 via-emerald-700 to-purple-700"
    const bgGradientLight = "bg-gradient-to-br from-customPink via-customIndigo to-customBlack "
    const h1Style = "pt-3 text-8xl text-white font-extrabold"
    const h2Style = "pt-3 mt-55 mb-20 text-5xl text-white font-bold text-center"
    const buttonStyle = "w-2/5 bg-purple-900 text-xl text-white font-semibold rounded-lg py-2 px-4 hover:bg-purple-600 focus:outline-purple-900 focus:shadow-outline-purple-900 active:bg-emerald-700"

    const buttonStyle2 = "bg-purple-900 mr-2 text-xl text-white font-semibold rounded-lg py-2 px-4 hover:bg-purple-600 focus:shadow-outline-purple-900"
    //purple-900
    //purple-600
    //emerald-700

    return (
        <>
     {/* comment  */}

    <div className={bgGradient}>
    <MiniNavBar />

    <div class="container mx-auto">
        <div class="flex justify-end">
        <div class="text-left w-3/5 pr-4">
        
        

        <div className="flex flex-col min-h-full justify-center mr-40">
        <h3 className="text-xl text-white font-semibold tracking-wider">ONLINE MULTIPLAYER GAMING</h3>
        <h1 className={h1Style}>OPPO GAMES</h1>
        <h2 className={basicFont}>Welcome to Oppo Games. An online platform to participate in retro, multiplayer games in live time. Join a game, chat with your opponent and have fun!</h2>
        
        <div className="pt-6">

        <a aria-label="Link to Register" href="/login">
        <button className={buttonStyle}>
        START PLAYING 
        </button>
        </a>

        </div>

            </div>
        </div>

        <div class="w-2/5 flex flex-col justify-center">
            <img 
                src={landingBg} 
                alt="3d-game-console-in-purple" 
                width="700px"
                className="transition duration-500 ease-in-out transition-transform hover:scale-110"
                ></img>
        </div>
        </div>
    </div>



    <h1 className={h2Style}>EXPLORE OUR LATEST GAMES</h1>
    <div class="grid grid-cols-3 gap-6 mr-20 ml-20 ">
  {/* TTT - Card 1 */}
        <div class="min-h-[140px] w-full place-items-left overflow-x-scroll rounded-lg p-6 lg:overflow-visible relative">
        <figure class="w-full h-96 relative hover:opacity-50 transition-opacity">
        <a aria-label="Link to Register" href="/tictactoe"> 
            <img class="object-cover object-center w-full h-full rounded-xl" src={gameCardTTT} alt="nature image" />
            <figcaption class="absolute bottom-8 left-2/4 transform -translate-x-2/4 flex w-[calc(100%-4rem)] -translate-x-2/4 justify-between rounded-xl border border-white bg-white/75 py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
                <div class="transition-opacity hover:opacity-0">
                <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                    Tic Tac Toe
                </h5>
                <p class="block mt-2 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                    play against a player and win
                </p>
                </div>
                <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                234 players online
                </h5>
            </figcaption>
            </a>
            </figure>
        </div>

        {/* RPS Card 2 */}
        <div class="min-h-[140px] w-full place-items-left overflow-x-scroll rounded-lg lg:overflow-visible relative">
        <div class="min-h-[140px] w-full place-items-left overflow-x-scroll rounded-lg p-6 lg:overflow-visible relative">
            <figure class="w-full h-96 relative hover:opacity-50 transition-opacity">
            <a aria-label="Link to Register" href="/rps">
            <img class="object-cover object-center w-full h-full rounded-xl" src={gameCardRPS} alt="nature image" />
            <figcaption class="absolute bottom-8 left-2/4 transform -translate-x-2/4 flex w-[calc(100%-4rem)] -translate-x-2/4 justify-between rounded-xl border border-white bg-white/75 py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
                <div class="transition-opacity ">
                <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                    Rock, Paper, Scissors
                </h5>
                <p class="block mt-2 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                    play against a player and win
                </p>
                </div>
                <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                108 players online
                </h5>
            </figcaption>
            </a>
            </figure>
        </div>
        </div>

        {/* BATTLESHIPS Card 3 */}
        <div class="min-h-[140px] w-full place-items-left overflow-x-scroll rounded-lg lg:overflow-visible relative">
        <div class="min-h-[140px] w-full place-items-left overflow-x-scroll rounded-lg p-6 lg:overflow-visible relative">
        <figure class="w-full h-96 relative hover:opacity-50 transition-opacity">
        <a aria-label="Link to Register" href="/battleships">
            <img class="object-cover object-center w-full h-full rounded-xl" src={gameCardBattle} alt="nature image" />
            <figcaption class="absolute bottom-8 left-2/4 transform -translate-x-2/4 flex w-[calc(100%-4rem)] -translate-x-2/4 justify-between rounded-xl border border-white bg-white/75 py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
                <div class="transition-opacity hover:opacity-0">
                <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                    Battleships
                </h5>
                <p class="block mt-2 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                    play against a player and win
                </p>
                </div>
                <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                84 players online
                </h5>
            </figcaption>
            </a>
            </figure>
        </div>
        </div>
        </div>





    </div>
    
    </>
    );
};

export default Landing;





