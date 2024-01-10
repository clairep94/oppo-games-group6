import React, { useState } from "react";
import landingBg from "../../assets/dual-console-image-white.png";
import SignUpForm from "../sign_up/SignUpPage";
import LoginForm from "../auth/LoginForm"

const Landing = ({ navigate }) => {
    const basicFont = "pt-3 text-white text-lg font-light tracking-widest text-wrap";
    const h1Style = "pt-3 text-8xl text-white font-extrabold";
    // const buttonStyle = "w-2/5 bg-customPink text-xl text-white font-semibold rounded-lg py-2 px-4 hover:bg-pink-600 focus:outline-none focus:shadow-outline-pink active:bg-pink-700";
    const buttonStyle = "w-2/5 text-xl text-white font-semibold rounded-lg py-3 px-4 hover:bg-pink-600/70 focus:outline-none focus:shadow-outline-pink active:bg-pink-700/80";

    const frostTexture = `
    backdrop-blur-md bg-purple-100/20 shadow-xl shadow-[#444a6b] border-[2.5px] border-white/10 place-self-center`

    const popupContainer = 'flex flex-col items-center justify-center rounded-[2.5rem]'


    // This stores the view state --> "Welcome", "Login", "Popup". If NOT Welcome, there is a pop up div with either the login or 
    const [view, setView] = useState("Welcome")

    const viewWelcome = () => setView("Welcome")
    const viewLogin = () => setView("Login")
    const viewSignup = () => setView("Signup")

    const [successMessage, setSuccessMessage] = useState(null); // success message for successful signup


    return (
        <>
        <div
            className=" flex flex-row items-center justify-center"
            style={{ backgroundImage: 'url(/backgrounds/islandfar.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh' }}>

            <div className="container mx-auto ">
            <div className="flex justify-end">

                {/* WELCOME MESSAGE */}
                {(view === "Welcome") ? (<>
                    <div className="text-left w-3/5 pr-4">
                    <div className="flex flex-col h-dvh justify-center pr-40">
                        <h3 className="text-xl text-white font-semibold tracking-wider">ONLINE MULTIPLAYER GAMING</h3>
                        <h1 className={h1Style}>OPPO GAMES</h1>
                        <h2 className={basicFont}>Welcome to Oppo Games. An online platform to participate in retro, multiplayer games in live time. Join a game, chat with your opponent and have fun!</h2>

                        <div className="pt-6">
                            <button className={buttonStyle} onClick={viewSignup}>
                                START PLAYING
                            </button>
                        </div>

                    </div>
                    </div>
                </>):(
                    <>
                    {/* LOGIN/SIGNUP CONTAINER */}
                    <div className={frostTexture + popupContainer}>

                    {view === "Signup" && (<SignUpForm navigate={navigate}/>)}
                    {view === "Login" && (<LoginForm navigate={navigate}/>)}

                    </div>
                    </>
                )}

                <div className="w-2/5 min-h-screen flex flex-col justify-center">
                {/* <img
                    src={landingBg}
                    alt="3d-game-console-in-purple"
                    width="700px"
                    className="transition duration-500 ease-in-out transition-transform hover:scale-110"
                ></img> */}
                </div>
            </div>
            </div>
        </div>
        </>
    );
};

export default Landing;
