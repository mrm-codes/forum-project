import React from 'react';
import { useState, useEffect, Link  } from'react';
//import Posts from './PostList';
//import UserDashboard from './UserDashboard';
import axios from 'axios';
import { FaPen } from 'react-icons/fa';
import '../Styles/forms.css';
import '../Styles/dash.css';



function CreateThreads({activeCategoryId}) {
    const [threads, setThreads] = useState([]);
    const [newThread, setNewThread] = useState('');
   

    // Create a Threads
  
    const createThread = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        if (!token) {
            console.error('Token not found');
            return;
        } 

        try {
            const response = await axios.post('http://localhost:3006/api/threads', {title: newThread, userId: userId, categoryId: activeCategoryId  },
                { headers: {'Authorization': `Bearer ${token}` }},
            );
            console.log('New Thread created', response.data);
            setThreads([...threads, response.data]);
            setNewThread('');

        } catch (error) {
            console.error('Error creating thread', error);
        }
      
    };

 
  return (
    <>
    <div className='threads'>
        <form className='thread-form' onSubmit={createThread}>
        <h2>Create a Post</h2>
            <input 
                type='text' 
                value={newThread} 
                onChange={(e) => setNewThread(e.target.value)} 
                placeholder='Start a Post or Ask something ...' 
            />
            
            <button type='submit'><FaPen/> Create Post</button>
        </form>
        

    </div>
     
    </>
  )
}

export default CreateThreads;