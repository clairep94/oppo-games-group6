import React, { useState, useEffect } from "react";

const PlaceholderNavbar = ({ }) => {
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const logout = () => {
    window.localStorage.removeItem("token");
    setToken(null);
  };
  if (token) {
    return (
      <div className="placeholder-navbar">
        <button onClick={logout}>Log out</button>
        <a href="/lobby">Games lobby</a>
      </div>
    );
  } else {
    return (
      <div className="placeholder-navbar">
        <a href="/login">Log in</a>
        <a href="/signup">Sign up</a>
      </div>
    );
  }
};

const InfoPage = ({ navigate, gameTitle }) => {
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
        <PlaceholderNavbar />
        <h2>Our Games: Rock Paper Scissors</h2>
        <p>
          Simultaneous moves? How does that work? With our hidden information game system,
          you can be sure that your opponent won't see what you're up to before they have
          to make their best move - and stick with it. If you're logged in, click the button
          below to start a new Rock Paper Scissors game and be redirected to its page. If
          you're not logged in, it will redirect you to the login screen, where you can create
          an account to play all the different games on our website and chat with other players.
        </p>
        <button onClick={startAndRedirectToNewGame}>Play Rock Paper Scissors</button>
      </>
    );
  }
};

export default InfoPage;
