import React,{useEffect, useState} from "react";
import {db,auth} from "../config/firebase"
import{ref, onValue,update} from "firebase/database";
import { useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";
import ChatInput from "./chatinput";
import axios from "axios";


function ChatMessage(){
    const location = useLocation();
    const currentUser = auth.currentUser;
    const currentUserId = currentUser?.uid;
    const { senderId, recieverId } = location.state || {};
     console.log("Sender ID:", senderId);
     console.log("Receiver ID:", recieverId);        


    const[messages, setMessages]= useState([]);
    useEffect(()=>{
         if (!senderId || !recieverId) {
            console.warn("Missing sender or receiver ID");
            return;
        }

        const messageref = ref(db, "Chats");

        const unsubscribe = onValue(messageref, (snapshot)=>{
            const data = snapshot.val();
            const filteredMessages = [];

            if(data){
                const allMessages = Object.entries(data);
                
                allMessages.forEach(([key,msg])=>{
                    const isBetweenUsers = (msg.sender== senderId && msg.receiver== recieverId) || (msg.sender== recieverId && msg.receiver== senderId);
                    
                    if(isBetweenUsers){
                        filteredMessages.push({id:key , ...msg})
                        if (msg.receiver === currentUserId && (msg.status === "NOT_SEEN"|| msg.status === undefined)){
                            console.log("Marking message as SEEN:", msg);
                            const updateRef = ref(db, `Chats/${key}`);
                            update(updateRef, { status: "SEEN" });
                        }
                    }

                })
                console.log("Filtered messages:", filteredMessages);
                setMessages(filteredMessages);
            } else {
                setMessages([]);
            }
        })
        return () => unsubscribe();
    },[senderId, recieverId])

     useEffect(() => {
    // Get message history from MongoDB
    const fetchHistory = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await axios.get(
          `http://localhost:5000/api/messages/${recieverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Optional: merge with Firebase messages or show separately
        console.log("MongoDB messages:", res.data);
        setMessages((prev) => [...prev, ...res.data]);
      } catch (err) {
        console.error("Failed to fetch MongoDB messages", err);
      }
    };

    if (senderId && recieverId) fetchHistory();
  }, [senderId, recieverId]);

    return(
        <div>
            <h3>Messages</h3>
            <ChatInput senderId={senderId} recieverId={recieverId} />
            <ul>
                {messages.map((msg,index)=>{
                    return(
                        <li key={index} style={{ marginBottom: "10px" }}>
                            <strong>{msg.sender=== senderId? "You":"Them"}</strong>
                            <div>{msg.text}</div>
                            <div style={{ fontSize: "0.75rem", color: "gray" }}>{msg.time} | {msg.date}
                                {msg.sender === senderId && (
                                <span style={{ marginLeft: "10px", color: "blue" }}>
                                {msg.status}
                                </span>
                            )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    )

}; 
export default ChatMessage;