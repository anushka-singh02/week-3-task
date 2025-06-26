import React, { useState } from "react";
import { db,auth } from "../config/firebase";
import { ref, push, update } from "firebase/database";
import axios from "axios";
import { useAuth } from "../config/AuthContext";

const ChatInput = ({ senderId, recieverId }) => {
  const [message, setMessage] = useState("");
  const {currentuser} = useAuth();

  const handleSend = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const user = auth.currentUser;
    if (!user) {
      throw new Error("No authenticated user found");
    }
    const token = await user.getIdToken();

    const msgObj = {
      text: message,
      sender: senderId,
      receiver: recieverId,
      time: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      status: "NOT_SEEN",
    };

    try {
      await push(ref(db, "Chats"), msgObj);

    //   const receiverRef = ref(db, `ChatLists/${recieverId}/${senderId}`);
      const senderRef = ref(db, `ChatLists/${senderId}/${recieverId}`);

    //   await update(receiverRef, { id: senderId });
      await update(senderRef, { id: recieverId });

      await axios.post("http://localhost:5000/api/messages", msgObj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      setMessage(""); // Clear input
    } catch (err) {
      console.error("Message sending failed", err);
      throw err;
    }
  };

  return (
    <form onSubmit={handleSend} style={{ display: "flex", gap: "10px" }}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
        style={{
          padding: "8px",
          flex: 1,
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "8px 16px",
          backgroundColor: "blue",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Send
      </button>
    </form>
  );
};

export default ChatInput;
