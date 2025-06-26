import {auth,app,db} from "./firebase";
import { useContext, createContext , useState,useEffect} from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut, getIdToken} from "firebase/auth";
import {set,ref,get,push} from 'firebase/database'
import axios from "axios";

export const AuthContext =  createContext();
export const useAuth =()=> useContext(AuthContext);

export const AuthProvider =(props)=>{
    const [currentuser , setCurrentuser] = useState('');
    const [loading , setLoading] = useState(true);
    
    async function register(email,password){
        try{
            console.log("registering...");
            const usercredential = await createUserWithEmailAndPassword(auth,email,password );
            const newUser = usercredential.user;
            console.log("newuser", newUser);

            const token = await newUser.getIdToken();
            console.log("token", token);

            await set(ref(db, `/users/${newUser.uid}`),{
            id : newUser.uid,
            email : newUser.email
            });
        
    
        await axios.post("http://localhost:5000/api/register", {
                email: newUser.email,
                firebaseUid: newUser.uid,
                password : newUser.password
            });
        }catch(err){
            console.log(err);
            throw err;
        }
    }

    function login(email,password){
        return signInWithEmailAndPassword(auth,email,password);
    }

    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged((user)=>{
            setCurrentuser(user);
            setLoading(false);
        })
    },[])

    function updateuserprofile(user,profile){
        return updateProfile(user, profile);
    }

    function logout(){
        return signOut(auth);
    }
    
    return(
        <AuthContext.Provider value={{register, login, currentuser, updateuserprofile, logout}}>
            {!loading && props.children}
        </AuthContext.Provider>
    )
};

