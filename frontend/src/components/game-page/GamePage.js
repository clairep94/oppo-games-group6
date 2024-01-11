import React, { useState, useEffect } from "react";
//import ThreeButtonsGame from "../../games/threebuttonsgame/ThreeButtonsGame";
import RockPaperScissors from "../../games/rps/RockPaperScissors";
import Battleships from "../../games/battleships/Battleships";
import { useParams } from 'react-router-dom';

// const PlaceholderNavbar = ({ }) => {
//   const { gameId } = useParams();
//   const [token, setToken] = useState(window.localStorage.getItem("token"));
//   const logout = () => {
//     window.localStorage.removeItem("token");
//     setToken(null);
//   };
//   if (token) {
//     return (
//       <div className="placeholder-navbar">
//         <button onClick={logout}>Log out</button>
//         <a href="/lobby">Games lobby</a>
//       </div>
//     );
//   } else {
//     return (
//       <div className="placeholder-navbar">
//         <a href="/login">Log in</a>
//         <a href="/signup">Sign up</a>
//       </div>
//     );
//   }
// };

// const PlaceholderChatbox = ({ }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const handleSubmitMessage = () => {
//     // Outside of the frontend placeholder, this would make a POST request to somewhere
//     // to send the new message (or it would do whatever you need to for socket.io)
//     setMessages(messages.concat([newMessage]));
//     setNewMessage('');
//   };
//   const handleNewMessageChange = (event) => {
//     setNewMessage(event.target.value);
//   };
//   return (
//     <div className="placeholder-chatbox">
//       {messages.map((message) => 
//         <p>{message}</p>
//       )}
//       <form onSubmit={handleSubmitMessage} >
//         <textarea id="new-message" value={newMessage} onChange={handleNewMessageChange} />
//         <input id="submit" type="submit" value="Send Message" />
//       </form>
//     </div>
//   );
// };

// This component should eventually be accessible at /<title of game>/<game id>
// for all game titles

const GamePage = ({ navigate, gameTitle }) => {
  // Parameter should be ID of game
  const { gameId } = useParams();
  const [token, setToken] = useState(window.localStorage.getItem("token"));

  // Ensure game page only available when logged in
  useEffect(() => {
    if (token) {
      // TODO: figure out if anything needs to be done here
    } else {
      navigate("/login");  // Redirect to login screen
    }
  }, [token, navigate]);

  // For now: only offer Rock Paper Scissors or an error page

  if (gameTitle === "Rock Paper Scissors") {
    return (
      <>
        <RockPaperScissors gameId={ gameId }/>
        {/* <PlaceholderChatbox /> */}
      </>
    );
  } else if (gameTitle === "Battleships") {
    return (
      <>
        <Battleships gameId={ gameId }/>
        {/* <PlaceholderChatbox /> */}
      </>
    )
  } else {
    return (
      <>
        <p>Oops! GamePage doesn't recognise that game title yet.</p>
      </>
    );
  }
};

export default GamePage;
