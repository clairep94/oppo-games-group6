import React, { useState, useEffect } from "react";
import MiniNavBar from "../navbar/MiniNavBar";
import gameCardRPSImage from "../../assets/yellow-green-low-poly-landscape-1th24g6bt64mgokg.jpg"

//STYLE VARS
const buttonStyleGamePage = "pr-20 pl-20 bg-purple-900 text-xl text-white font-semibold rounded-lg py-2 px-4 hover:bg-purple-600 focus:outline-purple-900 focus:shadow-outline-purple-900 active:bg-emerald-700";
const bgGradient = "bg-gradient-to-br from-emerald-400 via-emerald-700 to-purple-700 h-screen"
const basicFont = "pt-3 text-black text-lg font-medium tracking-wide text-wrap text-center"
const h1Style = "pt-3 text-6xl text-white font-extrabold text-center"



const InfoPage = ({ navigate, gameTitle }) => {

  const gameCardRPS = {
    backgroundImage: `url(${gameCardRPSImage})`,
    backgroundColor: 'rgba(126, 34, 206, 0.7)', //color and opacity???
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  };

  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const startAndRedirectToNewGame = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    let gamePath = null;
    if (gameTitle === "Rock Paper Scissors") {
      gamePath = "rps";
    } else {
      throw new Error("unrecognised game :(");
    }
    fetch(`/${gamePath}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        shouldJoin: true,
      }),
    })
    .then((res) => {
      if (res.status === 500) {
        throw res.json().error;
      }
      return res.json();
    })
    .then((data) => {
      window.localStorage.setItem("token", data.token);
      navigate(`/${gamePath}/${data.gameId}`);
    })
    .catch((error) => console.error(error));
  };
  if (gameTitle === "Rock Paper Scissors") {
    return (
      <>
      <div class="bg-auto h-screen" style={gameCardRPS}>
      
        <MiniNavBar />

        <div class="container mx-auto">
        <div class="flex justify-end">
        <div class="text-left w-3/5 pr-4">
        
        

        <div className="flex flex-col min-h-full justify-center mr-40">
        <h1 className={h1Style}>Rock Paper Scissors</h1>
        <p className={basicFont}> 
          Simultaneous moves? How does that work? With our hidden information game system,
          you can be sure that your opponent won't see what you're up to before they have
          to make their best move - and stick with it. If you're logged in, click the button
          below to start a new Rock Paper Scissors game and be redirected to its page. If
          you're not logged in, it will redirect you to the login screen, where you can create
          an account to play all the different games on our website and chat with other players.
        </p>

        <div className="pt-6">

        <a className="flex items-center justify-center" aria-label="Link to Register" href="/login">
        <button 
        className={buttonStyleGamePage}
        onClick={startAndRedirectToNewGame}>
        START PLAYING 
        </button>
        </a>

        </div>

            </div>
        </div>

        <div class="w-2/5 flex flex-col justify-center">
            <img 
                src={gameCardRPSImage} 
                alt="3d-game-console-in-purple" 
                width="700px"
                className="transition duration-500 ease-in-out transition-transform hover:scale-110"
                ></img>
        </div>
        </div>
    </div>








        </div>
      </>
    );
  }
};

export default InfoPage;
