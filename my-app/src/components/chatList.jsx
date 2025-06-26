import React,{useState, useEffect} from "react";
import {db,auth} from "../config/firebase"
import{ ref, onValue} from "firebase/database";
import { useNavigate } from "react-router-dom";
import ChatInput from "./chatinput";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import axios from "axios";

function ChatList(){
    const [chatUsers, setChatUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUser , setSelectedUser]= useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const navigate = useNavigate();

    const handleUserClick = (user) => {
        setSelectedUser(user);
        navigate("/Chats/message", {
        state: {
            
            recieverId: user.id,
            senderId: currentUserId,
      },
    });
  };
    //fetching logged in user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth,(user) => {
        if (user) {
            setCurrentUserId(user.uid);
        }else{
            setCurrentUserId(null);
        }
    });
    return () => {
        if(typeof unsubscribe === "function"){
            unsubscribe();
        }}
    }, []);

    useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const usersRef = ref(db, "/users");
        const unsubscribe = onValue(usersRef, (snapshot)=>{
            if(snapshot.exists()){
                const usersData = snapshot.val();
                const usersList = Object.values(usersData).filter(user => user.id !== currentUserId);
                setAllUsers(usersList);
            }else{
                setAllUsers([]);
            }
        })
     }catch (err) {
        console.error("Failed to fetch all users:", err);
      }
    }

    if (currentUserId) {
      fetchAllUsers();
    }
  }, [currentUserId]);

    useEffect(()=>{
        if(!currentUserId) return;

        const fetchUsers = async () => {
      try {
        const user = getAuth().currentUser;
        const token = await user.getIdToken();
        const res = await axios.get("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const filtered = res.data.filter((u) => u.firebaseUid !== currentUserId);
        setAllUsers(filtered);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();

        const chatref = ref(db, `/ChatLists/${currentUserId}`);

        const unsubscribe=  onValue(chatref,(snapshot)=>{
            const data = snapshot.val();
            console.log("Snapshot:", snapshot.val());
            if(data){
                const users = Object.values(data);
                setChatUsers(users);
            }else{
                setChatUsers([]);
            }
        })

    },[currentUserId])

    const combinedUsers = [...chatUsers];
        allUsers.forEach(user => {
        if (!combinedUsers.some(u => u.id === user.id)) {
            combinedUsers.push(user);
        }
    });
    useEffect(() => {
        console.log("selectedUser updated:", selectedUser);
    }, [selectedUser]); 
    return(
        
            <div>
                <h1>Chat List</h1>
                {combinedUsers.length === 0 ? (
                <p>No other users found. Invite someone to chat!</p>
                ) : (
                <>
                        {console.log("Rendering user list with combinedUsers:", combinedUsers)}
                        <ul style={{ listStyle: "none", padding: 0, backgroundColor: "white", border: "1px solid black" }}>
                                {combinedUsers.map((user) => (
                                <li
                                            key={user.id}
                                            onClick={() => handleUserClick(user)}
                                            style={{ color: "black", cursor: "pointer", padding: "5px", backgroundColor: "white" }}
                                >
                                {user.email || user.id}
                                </li>
                         ))}
                        </ul>
                </>
            )}


            {selectedUser &&(
            <div style={{ border: "2px solid red", padding: "10px", marginTop: "10px" }}>
                <ChatInput recieverId ={ selectedUser.id} senderId = {currentUserId} />
            </div>
        )}
        </div>
    );
}
export default ChatList;