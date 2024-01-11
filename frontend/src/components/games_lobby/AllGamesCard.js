import React, { useState } from 'react';

export default function GameTypeCard({ game, index, showGames}) {

    const [viewFront, setViewFront] = useState(true);

    // ============== FLIPPING THE CARD =========================    
    const flipToFront = () => {
        setViewFront(true);
    };

    const flipToBack = () => {
        setViewFront(false);
    };

    const flipCard = () => {
        setViewFront(!viewFront)
    }

    // ============== GAMES FILTERING =========================
    const handleAllGamesButtonClick = (e) => {
        e.stopPropagation();
        showGames("All");
    };

    const handleOpenGamesButtonClick = (e) => {
        e.stopPropagation();
        showGames("Open");
    };

    const handleYourGamesButtonClick = (e) => {
        e.stopPropagation();
        showGames("Your");
    };

    // ============ TAILWIND =====================
    const buttonStyle1 = // primary
    "w-[80%] text-md text-white font-semibold rounded-lg py-2 px-4 bg-pink-600/50 hover:bg-pink-600/70 focus:outline-none focus:shadow-outline-pink active:bg-pink-700/80";
    const buttonStyle2 = // secondary
        "w-[80%] text-md text-white font-semibold rounded-lg py-2 px-4 border-2 border-pink-600/50 hover:bg-pink-600/20 focus:outline-none focus:shadow-outline-pink active:bg-pink-700/80";


    // ============== JSX FOR UI OF COMPONENT =========================
    return (
        <div
        id={index}
        className="h-[full] min-w-[20rem] rounded-[1rem] overflow-clip flex flex-col relative text-black hover:cursor-pointer transition-opacity opacity-90 hover:opacity-100"
        onMouseEnter={flipToBack}
        onMouseLeave={flipToFront}
        >
        {viewFront ? (
            <>
            {/* CARD FRONT */}
            <img
                className="object-cover object-center w-full h-full rounded-xl"
                src={'/backgrounds/allGames.png'}
                alt="ttt"
            />
            <figcaption className="absolute bottom-8 left-2/4 transform flex w-[calc(100%-4rem)] -translate-x-2/4 justify-between rounded-xl border border-white bg-white/75 py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
                <div className="transition-opacity hover:opacity-0 h-[4rem]">
                <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                    All Games
                </h5>
                <p className="block mt-2 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                    View games of all types
                </p>
                </div>
            </figcaption>
            </>
        ) : (
            <div
            className="h-full w-full bg-black/60 text-white items-center justify-center flex flex-col"
            >
            {/* CARD BACK */}
            <h3 className="font-bold text-2xl">All Games</h3>
            <div className="w-full flex flex-col justify-center items-center mt-5 space-y-2">
                <button className={buttonStyle1} onClick={handleYourGamesButtonClick}>
                View Your Games
                </button>
                <button className={buttonStyle2} onClick={handleOpenGamesButtonClick}>
                View Open Games
                </button>
                <button className={buttonStyle2} onClick={handleAllGamesButtonClick}>
                View All Games
                </button>
            </div>
            </div>
        )}
        </div>
    );
}
