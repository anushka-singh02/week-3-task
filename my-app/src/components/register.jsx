import React , {useEffect, useState} from "react";
import { useAuth } from "../config/AuthContext";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {useNavigate} from 'react-router-dom';


function Register(){
    const [email, setEmail]= useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const {register, currentuser} = useAuth();
    const [loading, setLoading] = useState(false);
    // useEffect(()=>{
    //         if(currentuser){
    //             navigate("/Chats")
    //         }
    // },[currentuser, register])

    async function handleSubmit(e){
        e.preventDefault();

        if((password)!==(confirmPassword)){
            return (alert("passwords do not match"))
        }

        try{
            setLoading(true)
            await register(email, password);
            navigate("/Chats");
        }catch(err){
            alert("Failed to register , system error");
        }
        setLoading(false);
        
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
            <Form.Group className="mb-3" controlId="formConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit">Submit</Button>
            <br></br>
            <Form.Text className="text-muted mt-2" >
                 Already Registered? Click here to <a href="/login" >Login</a>;
            </Form.Text>
        </Form>
    )
};
export default Register;