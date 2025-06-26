import Logout from "./logout";
import React, {useEffect} from "react";
import { auth } from "../config/firebase";

function Header(){
    useEffect(()=>{
        async function fetchdata(){
            try{
                const user = auth.currentUser;
                const token = user && (await user.getIdToken());
                const payloadHeader = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                };
                const res = await fetch("http://localhost:5000", payloadHeader)
                console.log(res.text())
            }catch(err){
                console.log(err);
            }
        }
        fetchdata()
    },[])
};
export default Header;