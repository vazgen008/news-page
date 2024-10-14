import React, { useContext } from 'react';
import './PostsList.css';
import { AppContext } from '../../App';
import {Link} from 'react-router-dom'

const PostsList = ({ posts }) => {
  const { Data,User } = useContext(AppContext);

  return (
    <div>
      <Link to="/Addpost"><button className='Add-Blog-Button' disabled={User.Verified !== 'Verified'}>Add Blog</button></Link>
    <div className="posts-container">
      
      {posts.map((post) => {
        const author = post.anonymous 
          ? 'Anonymous' 
          : Data.find((user) => user.id === post.Userid)?.username || 'Unknown User';
        return (
          <div key={post.id} className="post-card">
            <h3>Title:{post.title}</h3>
            <p>Description:<br/>{post.description}</p>
            <p className="author">Author's Username: {author}</p>
          </div>
        );
      })}
    </div>
    </div>
  );
};

export default PostsList;
