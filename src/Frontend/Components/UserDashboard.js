import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {Link } from'react-router-dom';
import '../Styles/dash.css';
import img_sample from '../Media/nobody.jpg';
import { FaSearch } from "react-icons/fa";
import CreateThreads from './CreateThreads';
import ThreadsList from './ThreadsList';



function UserDashboard() {
  const [userData, setUserData] = useState(null);
  const [user, setUser] = useState('');
  const [error, setError] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState(8);
  const [userId, setUserId] = useState(null);
  
  const [categories, setCategories] = useState([]);
  // Getting user data from API 

  useEffect(() => {
    const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3006/api/users/me', {
        headers: { Authorization: `Bearer ${token}` } });

      const data = response.data;
      const user = data.username;
      const id = data.id;
      setUserData(data);
      setUser(user);
      setUserId(id);
      
      console.log(token);
    } catch (error) {
      setError('Failed to fetch user data');
    }
  };

  // Fetch user data on component mount
  fetchUserData();
  }, []); 

// Fetching categories from API
useEffect(() => {
  // Fetch categories from the backend
  axios.get('http://localhost:3006/api/categories')
    .then(response => {
      setCategories(response.data);
     
    })
    .catch(error => {
      console.error('Error fetching categories:', error);
    });
}, []);

// Fetching threads from API
 

// Functions

// Selecting active category
const selectActiveCategory = (id) => {
  setActiveCategoryId(id);

  // Get all category elements
  const categories = document.querySelectorAll('[id^=category-]');
  
  // Loop through and manage the 'active' class
  categories.forEach((category, index) => {
    // Add 'active' class to the selected category, remove from others
    if (index + 1 === id) {
      category.classList.add('active');
    } else {
      category.classList.remove('active');
    }
  });
};

  const handlingLogout = () => {
    localStorage.removeItem('token');
    axios.get('http://localhost:3006/api/users/logout'); // Logout user from API endpoint
    setUser('');
    setUserData(null);
    setError('');
    window.location.href = '/'; // Redirect to login page on logout.
  }

  const handleAboutVisibility = (e) => {
    e.preventDefault();
    // Toggle visibility of about us section
    document.querySelector('.about').classList.toggle('hide');
  }
  const handleCategoryVisibility = (e) => {
    e.preventDefault();
    // Toggle visibility of about us section
    
    document.querySelector('.categories-list').classList.toggle('hide');
  }

  return (
    <>
      {userData? (
        <div className='user-dash'>
          {/* Header */ }
          <div className='header'>
            <div className="logo">Tindza</div>
            
            
            <div className='search-bar'>
              <input type='text' placeholder='Search for threads...' />
              <button type='submit'><FaSearch /></button>
            </div>

            <div className='header-items'>
              <div className='message'>
                <div><img src={img_sample} alt='User' /> </div>
                <p>Welcome <span>{user}!</span></p>
              </div>
              
              <button>Profile</button>
              <button onClick={handlingLogout}>Logout</button>
            </div>
          </div>

          <div className='body'>
          {/* Navigation Menu */}
          <div className='nav-menu'>
            
            <button>New Posts</button>
            <button>Popular</button>
            <button onClick={handleCategoryVisibility}>See All Categories</button>
            <div className='categories-list'>
            {categories.map((category) => (
              <li 
              key={category.id} 
              id={`category-${category.id}`}  // Add data attribute to each category for easy selection
              // Change background color on hover}
              onClick={() => {
                setActiveCategoryId(category.id);
                selectActiveCategory(category.id)
              }}
              className='category-name'>{category.name}</li>
            ))}
            </div>
            <button onClick={handleAboutVisibility}>About us</button>
              <div className='about'>
                <p><span>Tindza</span>  question-and-answer platform where users can ask questions, share knowledge, and provide answers on a wide range of topics.</p>
                <p><strong>Our Headquarters:</strong> Suite. 907 99356 Ledner Light, New Jacquelyn, TX 85645-4311</p>
                <p><strong>Contact us: </strong>414 - 999 - 9999</p>
                <p>Tindza &copy; All the rights reserved 2024</p>
              </div>
          </div>

          {/* Content wrapper */}
          <div className='content-wrapper'>
            <div className='create-threads'><CreateThreads activeCategoryId={activeCategoryId}/></div>
            
            <div className='show-threads'>
              <ThreadsList 
              activeCategoryId={activeCategoryId}
              userId={userId}
              />
            </div>
            
          </div>

          </div>
        </div>
      ):(
        <div>
        <h3>Loading...</h3>
        {error && <div>{error}</div>}
      </div>
      )}
    </>
  );
};

export default UserDashboard;