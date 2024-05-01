import React, { useState } from "react";
import { Title } from "./title";
import axios from "axios";


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

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSend = () => {
    const newMessages = [...messages, { text: input, from: "user" }];
    setMessages(newMessages);
    setInput("");

    // Here you would typically send the input to your chatbot backend and get a response
    axios
      .post("http://localhost:3005/api/vectordb/get_data", { input })
      .then((res) => {
        // const formattedData = res.data.bot.map(obj => formatObjectForDisplay(obj)).join(" | ");
        const formattedData = res.data.bot.map(obj => formatObjectForDisplay(obj)).join("\n\n");

        const botResponse = { text: formattedData, from: "bot" };
        // const botResponse = { text: "Echo: " + res.data.bot.map(obj => obj.text).join(", "), from: "bot" };
        setMessages([...newMessages, botResponse]);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  return (
    <div>
      <h6>
        <Title handleLogout={handleLogout} />
      </h6>

      <div className="chat-history">
        {messages.map((msg, index) => (
          <p key={index} className={`message ${msg.from}`}>
            {msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Type a message..."
      />
      <button className="chat-button" onClick={handleSend}>
        Send
      </button>
    </div>
  );
};
