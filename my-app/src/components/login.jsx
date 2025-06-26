import React , {useEffect, useState} from "react";
import { useAuth } from "../config/AuthContext";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { onAuthStateChanged} from "firebase/auth"
import {useNavigate} from 'react-router-dom';


function Login(){
    const [email, setEmail]= useState('');
    const [password,setPassword] = useState('');
    const navigate = useNavigate();
    
    const {login, currentuser} = useAuth();
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if(currentuser){
            navigate("/Chats")
        }
    },[currentuser,login])

    async function handleSubmit(e){
        e.preventDefault();

        try{
            setLoading(true);
            await login(email,password);
            navigate("/Chats")
        }catch(err){
            alert("Server error , login failed")
        }
    }

    return(
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit">Submit</Button>
            <br></br>
            <Form.Text className="text-muted mt-2" >
                 Don't have an account? Click here to <a href="/register" >Register</a>;
            </Form.Text>
        </Form>
    )
};
export default Login;