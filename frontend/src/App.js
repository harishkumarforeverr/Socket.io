import "./App.css";

import { useState, useEffect } from "react";
import io from "socket.io-client";
import { nanoid } from "nanoid";

// no dotenv
const socket = io.connect("http://localhost:5000");
const userName = nanoid(4);

function App() {
  const [message1, setMessage1] = useState("");
  const [message2, setMessage2] = useState("");
  const [message3, setMessage3] = useState("");
  const [chat, setChat] = useState([]);
  const [welcomeMessage, setwelcomeMessage] = useState([]);

  const sendChat = (e) => {
    e.preventDefault();
    socket.emit("user", { message1, userName });
    setMessage1("");
  };
  const sendChatAll = (e) => {
    e.preventDefault();
    socket.emit("userAll", { message2, userName });
    setMessage2("");
  };
  const sendChatAllExceptOne = (e) => {
    e.preventDefault();
    socket.emit("toAllexceptOne", { message3, userName });
    setMessage3("");
  };
  // toAllexceptOne
  useEffect(() => {
    socket.on("welcome", () => {
      setChat((prev) => [
        ...prev,
        {
          message: "new user is added to chat",
        },
      ]);
    });
    socket.on("user", (payload) => {
      console.log("payload", payload);
      setChat((prev) => [
        ...prev,
        {
          message: payload.message1,
          userName: payload.userName,
        },
      ]);
    });
    socket.on("userAll", (payload) => {
      console.log("payload", payload);
      setChat((prev) => [
        ...prev,
        {
          message: payload.message2,
          userName: payload.userName,
        },
      ]);
    });
    socket.on("toAllexceptOne", (payload) => {
      console.log("payload", payload);
      setChat((prev) => [
        ...prev,
        {
          message: payload.message3,
          userName: payload.userName,
        },
      ]);
    });
  }, [socket]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chatty app</h1>
        {/* {welcomeMessage.map((val) => {
          return <h5>{val}</h5>;
        })} */}
        {chat.map((payload, index) => {
          return (
            <p key={index}>
              {payload.message}{" "}
              {payload.userName && <span> - id : {payload.userName}</span>}
            </p>
          );
        })}

        <form onSubmit={sendChat}>
          <h4>
            Socket IO event for speciic user who is listing for that event
          </h4>{" "}
          <input
            type="text"
            name="chat"
            placeholder="send text"
            value={message1}
            onChange={(e) => {
              setMessage1(e.target.value);
            }}
          />
          <button type="submit">Send</button>
        </form>
        <br />
        <br />

        <form onSubmit={sendChatAll}>
          <h4> Socket IO event for all the user</h4>{" "}
          <input
            type="text"
            name="chat"
            placeholder="send text"
            value={message2}
            onChange={(e) => {
              setMessage2(e.target.value);
            }}
          />
          <button type="submit">Send</button>
        </form>
        <br />
        <br />

        <form onSubmit={sendChatAllExceptOne}>
          <h4>
            {" "}
            Socket IO fevent is fired for all the user except one howis trigging
            it
          </h4>{" "}
          <input
            type="text"
            name="chat"
            placeholder="send text"
            value={message3}
            onChange={(e) => {
              setMessage3(e.target.value);
            }}
          />
          <button type="submit">Send</button>
        </form>
      </header>
    </div>
  );
}

export default App;
