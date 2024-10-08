import React, {useState, useRef, useEffect } from 'react';
import '../Styles/forms.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {FaTimes, FaCheck, FaInfoCircle, FaUser} from 'react-icons/fa';



const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}/; //Username regex
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8-24}$/; //Password Regex


function Register() {
    //User field
    const userRef = useRef();
    const errRef = useRef();

    //User field
    const [usernameList, setUsernameList] = useState([]);
    const [username, setUsername] = useState('');
    const [validName, setValidName] = useState(false);
    

    //Email
    const [email, setEmail] = useState('');

    //Password field
    const [password, setPassword] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    

    //Confirm/Match Password
    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    
    //saving data
    const [data, setData] = useState({});

    //Result Message
    const [errMsg, setErrMsg] =useState('');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

    // Fetching the username list
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get('http://localhost:3006/api/users/usernames');
               
                const data = result.data;
                const usernames = data.map(user => user.username);
                setUsernameList(usernames);
                  

            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [username]);

    useEffect(() =>{
        const result = USER_REGEX.test(username);
        if (usernameList.includes(username) && result){
            console.log('exists');
            setErrMsg('Username already exists');
        } else {
            console.log('doesnt exist');
            setErrMsg('');
            setValidName(result);
            console.log('Valid user')

        }
       
        
        
    }, [username])

    useEffect(() =>{
        const result = PWD_REGEX.test(password);
        console.log(result);
        console.log(password);
        setValidPwd(result);
        const match = password === matchPwd;
        setValidMatch(match);
    }, [password, matchPwd])

    useEffect(() =>{
        setErrMsg('');
    }, [username, password, matchPwd])

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const userData = {
            username,
            email,
            password,
          };

        try {
             // Send POST request to register the user
            const response = await axios.post('http://localhost:3006/api/auth/register', userData, {
                headers: {
                'Content-Type': 'application/json',
                },
            });

            // Handle the response
            if (response.status === 201) {
                setMessage('User registered successfully!');
                setSuccess(true);
            }
        } catch (error) {
            // Handle errors, e.g., user already exists or validation failed
            if (error.response) {
                setMessage(error.response.data.message || 'Error registering user.');
        } else {
            setMessage('Error connecting to the server.');
        }
        }
      
       
    };


  return (
    <>
    {success ? (
        <div className='success-message'>
            <h2>Success! </h2>
            <p><span>{username}</span> Successfull registerd!  <FaCheck/></p>
             
            <p><Link to='/Login'>Sign in</Link></p>
        </div>
    ):(
    <div className='Register'>
        
        <p
            ref={errRef}
            className={errMsg ? "errMsg" : "offscreen"}
            aria-live="assertive"
        >{errMsg}</p>
        
        <form className='RegisterForm' onSubmit={handleSubmit}>
            <h2>Register <FaUser/></h2>

            {/* -------- username ---------- */}
            <label htmlFor='username' className='usernameLabel'>Username:
            </label>
            <input 
                type='text'
                id='username'
                ref={userRef}
                autoComplete='off'
                onChange={(e) => setUsername(e.target.value)}
                placeholder='jdoe'
                required
                aria-invalid={validName ? "false" : "true"}
                aria-describedby='userIdNote'
                className={validName ? "valid" : "invalid"}
               
            />
            <p
                id='userIdNote'
                className={username && !validName ? "intructions" : "offscreen"}
            ><span><FaInfoCircle/> </span> 
            4 - 24 characters. Must begin with a letter.<br/>
            Letters, Numbers, Underscores, hyphens allowed.
            </p>
            
            {/* -------- email ---------- */}
            <label htmlFor='email' className='emailLabel'>Email:
               
            </label>
            <input 
                type='email'
                id='email'
                onChange={(e) => setEmail(e.target.value)}
                autoComplete='off'
                placeholder='johndoe@aol.com'
                required
                
                
            />
            

            {/* -------- password ---------- */}
            <label htmlFor='password' className='passwordLabel'>Password: 
            
            </label>
            <input
                type='password'
                id='password'
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-invalid={validPwd ? "false" : "true"}
                aria-describedby='passwordNote' 
                className={validName ? "valid" : "invalid"}
                
            />
            <p
                id='passwordNote'
                className={!validPwd  ? "intructions" : "offscreen"}
            ><span><FaInfoCircle/> </span> 
            8 - 24 characters. Must begin with a letter.<br/>
            Letters, Numbers, Underscores, hyphens allowed. <br/>
            Allowed specia characters: 
            <span aria-label='exclamation mark'>!</span>
            <span aria-label='at symbol'>@</span>
            <span aria-label='hashtag'>#</span>
            <span aria-label='dollar sign'>$</span>
            <span aria-label='percent'>%</span>

            </p>
        
            <label htmlFor='confirmPassword' className='confirmLabel'>Confirm Password: </label>
            
        <input
           type='password'
           id='confirmPassword'
           onChange={(e) => setMatchPwd(e.target.value)}
           required
           aria-invalid={validMatch ? "false" : "true"}
           aria-describedby='confirmNote' 
           className={validMatch && matchPwd ? "valid" : "invalid"}
        />

        
            <p
                id='confirmNote'
                className={!validMatch ? "intructions" : "offscreen"}
            ><span><FaInfoCircle/> </span> 
            Must match the first password field

            </p>
            <button
            type='submit'
                onClick={()=>{
                    setData({"data": {username,email,password}})
                }}
                disabled={!validName || !validMatch ? true : false}
            >Register</button>

        <p>Need Help? <span className='clickHere'>Click Here</span></p>
            
        </form>

    </div>
    )}
    </>
  )
  
}


export default Register;