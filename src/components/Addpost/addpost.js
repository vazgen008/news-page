import React, { useState } from 'react';
import './PostForm.css'; // Import the CSS file
import { AppContext } from "../../App";
import { useEffect, useContext } from 'react';
import  Axios  from 'axios';

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const { User } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const post = {
      title,
      description,
      anonymous,
      Userid: User.id,
    };
    
    try {
      // Post the data
      const response = await Axios.post(`${process.env.REACT_APP_POSTS_URL}.json`, post);
      const uniqueKey = response.data.name;
  
      // Patch the data with the unique key
      await Axios.patch(`${process.env.REACT_APP_POSTS_URL}/${uniqueKey}.json`, { id: uniqueKey });
  
      alert('Post created successfully:');
      window.location.reload();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };
  

  return (
    <div className="post-form-container">
      <h2>Create a Post</h2>
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="anonymous"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
          />
          <label htmlFor="anonymous">Post Anonymously</label>
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default PostForm;
