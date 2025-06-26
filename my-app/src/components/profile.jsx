import React,{ useState, useEffect} from "react";
import { useAuth } from "../config/AuthContext";
import {useNavigate} from "react-router-dom"

function Profile(){
    const [username, setUsername]= useState('')
    const {currentuser, updateuserprofile} = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleupdate(e){
        e.preventDefault;

        try{
            setLoading(true);
            const user = currentuser;
            const profile ={displayName : username};
            await updateuserprofile(user,profile);
            alert("Profile updated");
            navigate("/Chats");
        }catch(err){
            alert("failed update , server error")
        }
        setLoading(false);
    }

    return(
        <form onSubmit={handleupdate}>
          <div className="rounded-md shadow-sm -space-y-px">
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 placeholder-gray-500 rounded-t-md bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Enter a Display Name"
              defaultValue={currentuser.displayName && currentuser.displayName}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <button type="submit" disabled={loading}   style={{
                backgroundColor: "#1D4ED8", // Blue
                color: "white",
                padding: "10px 16px",
                fontSize: "14px",
                fontWeight: "500",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
            }} >Update Profile </button>
          </div>
        </form>
        

    )
};
export default Profile;