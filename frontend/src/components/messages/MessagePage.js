import React, { useEffect, useState, useRef } from 'react';
//import io from "socket.io-client";
//import MessagesController from '../../../../api/controllers/message';


const MessagePage = ({navigate}) => {
  //const [messages, setmessages] = useState([])

  return  (
    <div className = "Messenger">
        <div classname = "MessageLog" placeholder = "message history here"></div>
        <div classname = "MessageInput" placeholder= "write message here"></div>
        <button classname= "SubmitButton"><h2>submit</h2></button>

    </div>
  )
}

export default MessagePage;
