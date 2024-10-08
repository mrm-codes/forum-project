import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/dash.css';
import CreatePost from './CreatePost';
import { FaHeart, FaHeartBroken,  FaComment} from'react-icons/fa';
//import PostList from './PostList';

function ThreadsList({activeCategoryId, userId}) {
  const [threads, setThreads] = useState([]);
  const [threadId, setThreadId] = useState(null);
  const [activeThreadId, setActiveThreadId] = useState(1);
  const [posts, setPosts] = useState([]);
  //const [activeUserId, setActiveUserId] = useState(null);
 
  useEffect(() => {
    // Fetch threads from the backend API
    const fetchThreads = async () => {
      try {
        
        const response = await axios.get('http://localhost:3006/api/threads');
        const fetchedData = response.data.filter((thread) => thread.categoryId === activeCategoryId);
        
        setThreads(fetchedData);
   
      } catch (error) {
        console.error('Error fetching threads', error);
      }
    };

    fetchThreads();
  },[activeCategoryId]);

  useEffect(() => {
    // Fetch threads from the backend API
    const fetchPosts = async () => {
      try {
        
        const response = await axios.get('http://localhost:3006/api/threads/posts');
        const fetchedData = response.data.filter((post) => post.threadId === activeThreadId);
        setPosts(fetchedData);
        console.log('Filtered posts:', fetchedData);
   
      } catch (error) {
        console.error('Error fetching threads', error);
      }
    };

    fetchPosts();
  },[activeThreadId]);
  //console.log('userId From Thread List:', userId);

  const handleComments = (id) => {
    // Toggle the comments for the active thread
    const threads = document.querySelectorAll('[id^=thread-]');
    
    threads.forEach((thread) => {
      const threadId = parseInt(thread.id.replace('thread-', ''), 10);
      if (threadId === id) {
        thread.classList.toggle('to-comments');
        console.log('Comments are now visible for thread:', threadId);
      } else {
        thread.classList.remove('to-comments');

      }
    });
  }


  

  return (
    <div className='thread-list'>
      <h1>Threads</h1>
      <ul>
        {threads.map((thread) => (
          <li key={thread.id} className='list-item' id={`thread-${thread.id}  `}>
            <h2 className='title'>{thread.title}</h2>
            <div className='details'>
              <p>Created by: <span className='thread-author'>{thread.User.username}</span> </p>
              <p>Created at: {new Date(thread.createdAt).toLocaleString()}</p>
              
            </div>

            <div className='post-list'>
              {
                posts.filter((post) => post.threadId === thread.id).map((post) => (
                  <div key={post.id} className='post'>
                    <p>{post.content}</p>
                    <div className='details'>
                      <p>Posted by: <span className='post-author'>{post.User.username}</span></p>
                      <p>Posted at: {new Date(post.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              }
            </div>
            
          
            <div className='buttons'>
              <button 
                onClick={() => {
                  setThreadId(thread.id);
                  handleComments(thread.id);
                  setActiveThreadId(thread.id);
                  
              }}><FaComment/></button>

              <button ><FaHeart/></button>
              <button ><FaHeartBroken/></button>

            </div> 

            <div className='comment-form'>
                <CreatePost 
                  threadId={threadId}
                  activeThreadId={activeThreadId}
                  userId={userId}
                />
            </div>

          </li>
        ))}
      </ul>
      
    </div>
  );
}

export default ThreadsList;
