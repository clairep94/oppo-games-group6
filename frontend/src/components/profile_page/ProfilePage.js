import React, { useEffect, useState } from 'react';
import {useParams} from "react-router-dom";
import getSessionUserID from "../../utility/getSessionUserID";
import APIProfilePicture from '../../utility/profilePictureFromAPI'; // placeholder unique profile picture for each userID


const ProfilePage = ({ navigate }) => {

    // =========== STATE VARIABLES ==========================

    //TODO change the profile route to 'users/:username' instead of 'users/:id' later on...
    
    // --------- Session User ID & ID of Profile Page Owner ----------
    const [token, setToken] = useState(window.localStorage.getItem("token"));
    const sessionUserID = getSessionUserID(token);
    const { id } = useParams(); // IMPORTANT: DO NOT RENAME 'id' This refers to gameID but changing it would cause issues in routes etc.
    const targetUserID = id;

    // ---------- Profile states --------------
    const [user, setUser] = useState(null); // stores the user object retrieve from the DB
    const ownProfile = sessionUserID === targetUserID; // conditional render of information/buttons based on if this the user's profile or not

    // ============ LOADING THE PROFILE =============
    // Function to fetch userdata from the database for this specific user
    const fetchUser = () => {
        fetch(`/users/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((res) => res.json())
        .then((data) => {
            window.localStorage.setItem("token", data.token)
            setToken(window.localStorage.getItem("token"))
            setUser(data.user)
        })
    }

    useEffect(() => {
        if(token) {
            fetchUser()
        }
    }, []);

    const h2Style = "text-2xl text-white font-bold text-center"

    // ============ JSX FOR THE UI =============
    // NOTE: this takes the profile picture from a random user profile picture API.
    return (
        <>
            {ownProfile ? 
                <>
                {/* Achievement scores */}
                {/* achievement tic tac toe */}
            <div class="min-h-[140px] w-full place-items-left overflow-x-scroll rounded-lg p-6 lg:overflow-visible relative">
                <figure class="w-full h-96 relative transition-opacity">
                <a aria-label="achievements-of-game-plays" href="/tictactoe"> 
                    <figcaption class="absolute bottom-8 left-2/4 transform -translate-x-2/4 flex w-[calc(100%-4rem)] -translate-x-2/4 justify-between rounded-xl border border-white py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
                    <h2 className={h2Style}>Tic Tac Toe:</h2>
                        <div class="transition-opacity hover:opacity-0">
                        <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                            WINS: 5
                        </h5>
                        </div>
                        <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                            LOSSES: 8
                        </h5>
                        <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                            DRAWS: 2
                        </h5>
                    </figcaption>
                    </a>
                    </figure>
            </div>
            {/* achievement rock paper scissors */}
            <div class="min-h-[140px] w-full place-items-left overflow-x-scroll rounded-lg p-6 lg:overflow-visible relative">
                <figure class="w-full h-96 relative transition-opacity">
                <a aria-label="achievements-of-game-plays" href="/tictactoe"> 
                    <figcaption class="absolute bottom-8 left-2/4 transform -translate-x-2/4 flex w-[calc(100%-4rem)] -translate-x-2/4 justify-between rounded-xl border border-white py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
                    <h2 className={h2Style}>Rock Paper Scissors:</h2>
                        <div class="transition-opacity hover:opacity-0 content-start">
                        <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                            WINS: 7
                        </h5>
                        </div>
                        <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                            LOSSES: 3
                        </h5>
                        <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                            DRAWS: 1
                        </h5>
                    </figcaption>
                    </a>
                    </figure>
            </div>
            {/* achievement battleships */}
            <div class="min-h-[140px] w-full place-items-left overflow-x-scroll rounded-lg p-6 lg:overflow-visible relative">
                <figure class="w-full h-96 relative transition-opacity">
                <a aria-label="achievements-of-game-plays" href="/tictactoe"> 
                    <figcaption class="absolute bottom-8 left-2/4 transform -translate-x-2/4 flex w-[calc(100%-4rem)] -translate-x-2/4 justify-between rounded-xl border border-white py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
                    <h2 className={h2Style}>Battleships:</h2>
                        <div class="transition-opacity hover:opacity-0">
                        <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                            WINS: 10
                        </h5>
                        </div>
                        <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                            LOSSES: 0
                        </h5>
                        <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                            DRAWS: 0
                        </h5>
                    </figcaption>
                    </a>
                    </figure>
            </div>

                    <p>avatar image name header from lobby</p>
                    <p>Achievements</p>
                
                    

                    <h2>{user ? `${user.username}'s profile`: "Loading"}</h2>
                    <p>Welcome back {user ? `${user.username}`: "Loading"}</p>
                    <h3>Profile:</h3>
                        {/* <APIProfilePicture id={id}/> */}
                        <img src={`https://api.dicebear.com/7.x/rings/svg?seed=${sessionUserID}`} width="300px" alt="avatar" />
                    <h4>Points: {user ? `${user.points}`: "Loading"}</h4>
                    <h4>Active Games:</h4>
                    <h4>Open Games:</h4>
                    <h4>Past Games:</h4>

                </>
                :
                <>
                    <h2>{user ? `${user.username}'s profile`: "Loading"}</h2>
                    <p>Challenger</p>
                    <h3>Profile:</h3>
                        <APIProfilePicture id={id}/>
                    <h4>Points: {user ? `${user.points}`: "Loading"}</h4>
                    <h4>Active Games:</h4>
                    <h4>Open Games:</h4>
                    <h4>Past Games:</h4>
                </>
            
            }

        </>
    );
};

export default ProfilePage;