import React, { useEffect, useState, useRef } from 'react';

const ComponentThatPolls = ({ }) => {
  //Stuff for polling and message processing
  const [inbox, setInbox] = useState("Example inbox initial value");
  const pollingTimer = useRef(null);
  const [shouldDoPolling, setShouldDoPolling] = useState(true);

  // Auth
  const [token, setToken] = useState(window.localStorage.getItem("token"));

  useEffect(() => {
    const pollingCallback = () => {
      console.log("Polling now");
      fetch("/endpoint-to-poll", {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ clientWouldLikeTo: "get some data" }),
      })
      .then(res => res.json())
      .then(async data => {
        // data should have properties: data.token, data.<info client wants>
        window.localStorage.setItem("token", data.token);
        setToken(window.localStorage.getItem("token"));
        // Example use case: just store the message in the inbox
        setInbox(data.message);
      });
    };
    if (shouldDoPolling) {
      // Poll every 5 seconds in this example
      // (For a game, we might want to poll every 2 seconds, so we
      // don't waste as much of the user's time)
      pollingTimer.current = setInterval(pollingCallback, 5000);
    } else {
      clearInterval(pollingTimer.current);
    }
    // useEffect returns a "cleanup function", which is called
    // when the component unmounts.
    return () => {
      clearInterval(pollingTimer.current);
    };
  }, [inbox, token, shouldDoPolling]);

  // Functions to be called from inside the component
  // (e.g. via buttons)
  const startPollingPlease = () => {
    console.log("Polling mode enabled");
    setShouldDoPolling(true);
  };
  const stopPollingPlease = () => {
    console.log("Polling mode disabled");
    setShouldDoPolling(false);
  };

  return(
    <>
      <h2>Polling Example</h2>
      <button onClick={startPollingPlease}>Click to start polling every 5 seconds</button>
      <button onClick={stopPollingPlease}>Click to stop polling</button>
      <p>Polling is currently {shouldDoPolling ? "enabled" : "disabled"}</p>
      <p>Inbox contents: {inbox}</p>
    </>
  );
};

export default ComponentThatPolls;
