import React, { useState } from "react";
import { Title } from "./title";
import axios from "axios";

var userInput = ""

const formatObjectForDisplay = (obj, prefix = '') => {
  const formatEntry = (key, value) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return `${prefix}${key}: {\n${formatObjectForDisplay(value, prefix + '  ')}\n${prefix}}`;
    } else if (Array.isArray(value)) {
      return `${prefix}${key}: [\n${value.map(v => formatObjectForDisplay(v, prefix + '  ')).join(',\n')}\n${prefix}]`;
    } else {
      return `${prefix}${key}: ${value}`;
    }
  };
  return Object.entries(obj).map(([key, value]) => formatEntry(key, value)).join('\n' + prefix);
};

export const Chatbot = ({ handleLogout }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sqlStatement, setSqlStatement] = useState('');
  const [embedding, setEmbedding] = useState('');

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSend = () => {
    const newMessages = [...messages, { text: input, from: "user" }];
    setMessages(newMessages);
    userInput = input;
    setInput("");

    axios
      .post("http://localhost:3005/api/vectordb/get_data", { input })
      .then((res) => {
        const formattedData = res.data.bot.map(obj => formatObjectForDisplay(obj)).join("\n\n");
        const botResponse = { text: formattedData, from: "bot" };
        setSqlStatement(res.data.sql);
        setEmbedding(res.data.embedding);
        setMessages([...newMessages, botResponse, { text: "Was the data displayed correctly?", from: "feedback" }]);
      })
      .catch((error) => {
        console.error("Error", error);
        alert("Sorry, can you try again?");
      });
  };

  const handleFeedback = async (feedback) => {
    try {
      await axios.post("http://localhost:3005/api/vectordb/feedback", {
        userInput: userInput,
        sqlStatement: sqlStatement,
        feedback: feedback, 
        embedding: embedding
      })
      .then((res) => {
        alert(res.data.message);
      })
      
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to record feedback.');
    }
  };

  return (
    <div className="chat-container">
      <h6>
        <Title handleLogout={handleLogout} />
      </h6>

      <div className="chat-history">
        {messages.map((msg, index) => {
          if (msg.from === "feedback") {
            return (
              <div key={index}>
                <br />
                <p className="message bot">{msg.text}</p>
                <button className="feedback-button" onClick={() => handleFeedback("YES")}>Yes</button>
                <button className="feedback-button" onClick={() => handleFeedback("NO")}>No</button>
                <br />
                <br />
                <hr />              
              </div>
            );
          } else {
            return (
            <div>
              <br />
              <p key={index} className={`message ${msg.from}`}>{msg.text}</p>)
              <hr />
            </div>
        );
        }
        })}
      </div>
      <div className="input-button-container">
        <input className="input-area"
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
        />
        <button className="chat-button" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};
