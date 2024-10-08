import React, {useState, useRef, useEffect } from 'react';
import UserDashboard from './UserDashboard';
import { Link } from 'react-router-dom';
import axios from 'axios';


function Login({onChangeStatus}) {

    // States
    // Authentication states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState(null)

    // Message states
    const userRef = useRef();
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(null);


    // Functions
    // Status change function
    
    // Submitting form and sending a login request
    const handleSubmit = async () =>{
        //e.preventDefault();
        
        const userData = { email, password };

        
        // Attempt to login
        try {
            const response = await axios.post('http://localhost:3006/api/auth/login', userData);
            const { token, user, userId } = response.data;
            
            //const username = user.username;
            //setUserId(user.id);
            //setUsername(username);
            //const email = user.email;
            // Store the token (localStorage or state)
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            localStorage.setItem('user', user);
    
            onChangeStatus(true);
          
           // const message = `Welcome ${username}.`
            //console.log('message', message)
            
            // You can redirect the user or set the state for logged-in user here
        } catch (error) {
            setMessage(error.response ? error.response.data.message : 'Login failed');
        }
       
    } 
   
 

  return (
    <div className='Login'>
        <p
            ref={errRef}
            className={errMsg ? "errMsg" : "offscreen"}
            aria-live="assertive">{errMsg}</p>
        
        <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
            }} className='signForm'>
            <h2>  Sign In </h2>
            <label htmlFor='email'>Email:</label>
            <input 
                type='email'
                id='email'
                value={email}
                ref={userRef}
                autoComplete='off'
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <label htmlFor='password'>Password:</label>
            <input 
                type='password'
                id='password'
                ref={userRef}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <button type='submit' >Sign In</button>
            <p>Need an Account? <Link to="/Register" ><span>Sign Up here!</span></Link></p>
        </form>
    </div>
  );
}

export default Login;