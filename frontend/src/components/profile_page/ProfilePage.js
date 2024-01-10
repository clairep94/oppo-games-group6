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

    // ============ JSX FOR THE UI =============
    // NOTE: this takes the profile picture from a random user profile picture API.
    return (
        <>
            {ownProfile ? 
                <>
                    <h2>{user ? `${user.username}'s profile`: "Loading"}</h2>
                    <p>Welcome back {user ? `${user.username}`: "Loading"}</p>
                    <h3>Profile:</h3>
                        <APIProfilePicture id={id}/>
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