import React from "react";
import { useAuth } from "../config/AuthContext";
import {useNavigate} from "react-router-dom"

function Logout(){
    const {logout , currentUser} = useAuth();
    const navigate =useNavigate();

    async function handlelogout(e){
        e.preventDeafault;

        try{
            await logout();
            navigate("/login");
        }catch(err){
            alert("Logout failed , system error");
        }
    }
    return (
        <div>
            <button onClick={handlelogout} style={{
                backgroundColor: "#1D4ED8", 
                color: "white",
                padding: "10px 16px",
                fontSize: "14px",
                fontWeight: "500",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
            }} >Logout</button>
        </div>
    )
};
export default Logout;