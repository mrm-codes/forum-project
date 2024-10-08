import React, { useState } from "react";
import Login from "./Frontend/Components/Login";
import Register from "./Frontend/Components/Register";
import { BrowserRouter as Router, Route, Navigate, Routes, Link, useLocation } from "react-router-dom";
import UserDashboard from "./Frontend/Components/UserDashboard";


function App() {
  const [isloggedIn, setIsLoggedIn] = useState(false);
  const loginStatus = (status) => {
    setIsLoggedIn(status);
  };


  return (
      <>
      {isloggedIn ? ( <UserDashboard />
      ) : (
        <div className="App">
        <Router>
        <div className="navigation">
          <div className="logo"><Link to='/'>Tindza </Link></div>
          <div className="nav-items">
            <ul>
              <Link to="/" ><li>Home</li></Link>
              <Link to="/Register" ><li>Register</li></Link>
              <Link to="/Login" ><li>Login</li></Link>
            </ul>
          </div>

          
          <Routes>
            <Route exact path="/" element={<Login onChangeStatus={loginStatus}/>} />
            <Route exact path="/Login" element={<Login onChangeStatus={loginStatus}/>} />
            <Route exact path="/Register" element={<Register />} />
            <Route path="/Dashboard" element={< UserDashboard/>} />
          </Routes>
        
        </div>
        </Router>
        
        
        

      </div>
      )}
      
      </> 
  );
}

export default App;
