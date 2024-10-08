import React, { useState, useEffect } from 'react';
import { FaAngleDoubleRight } from 'react-icons/fa';
import axios from 'axios';
import '../Styles/dash.css';

function CreatePost({threadId, activeThreadId, userId}) {
    const [content, setContent] = useState('');
    const [posts, setPosts] = useState([]);

    const createPost = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        console.log('user id...', userId);
        console.log('Creating new post...', threadId);

        if (!token) {
            console.error('Token not found');
            return;
        } else {
            console.log('Token Found');  
        }

        try {
            const response = await axios.post('http://localhost:3006/api/post', {content: content,  threadId: threadId },
                { headers: {'Authorization': `Bearer ${token}` }},
            );
           console.log('New post was created', response.data);
           setPosts([...posts, response.data]);
           setContent('');

        } catch (error) {
            console.error('Error creating post', error);
        }

    };

  return (
    <div className='posts' id={`post-${threadId}`}>
        <form onSubmit={createPost}>
            <button type='submit'><FaAngleDoubleRight/></button>
            <textarea 
                type='text' 
                value={content} 
                onChange={(e) => setContent(e.target.value)} placeholder='Write or comment a post...' />
        </form>

    </div>
  )
}

export default CreatePost;