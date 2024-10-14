import { useContext } from "react";
import { AppContext } from "../../App";
import Axios from 'axios';
import { useEffect, useState } from 'react';
import PostsList from '../AllPosts/PostList'
import { useTranslation } from "react-i18next";
export const HomePage = function(){
    const [isLoading, setIsLoading] = useState(true);
    
    const { t } = useTranslation();

    const { fetchData,User} = useContext(AppContext);

    const deleteDuplicateUsers = async () => {
        try {
            const response = await Axios.get(`https://news-1a134-default-rtdb.firebaseio.com/.json`);
            const users = response.data;
    
            const uniqueUsers = {};
            const keysToDelete = [];
    
            // Loop through users to find duplicates
            Object.entries(users).forEach(([key, user]) => {
                if (!uniqueUsers[user.username]) {
                    uniqueUsers[user.username] = key; // Keep the first key for this username
                } else {
                    keysToDelete.push(key); // Collect duplicate keys for deletion
                }
            });
    
            // Now delete all duplicates
            for (const key of keysToDelete) {
                await Axios.delete(`https://news-1a134-default-rtdb.firebaseio.com//${key}.json`);
            }
            console.log('Duplicates deleted, only unique users remain.');
    
        } catch (error) {
            console.error('Error fetching or deleting users:', error);
        }
    };
    const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await Axios.get(`https://news-posts-598b9-default-rtdb.firebaseio.com/.json`);
        const fetchedPosts = Object.keys(response.data).map(key => ({
          ...response.data[key],
          id: key,
        }));
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);
    useEffect(() => {
        const fetchDataAndCheck = async () => {
            await deleteDuplicateUsers()
            await fetchData();
        };
        fetchDataAndCheck();
    }, []);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000); // 2 seconds delay

        return () => clearTimeout(timer);
    }, []);
   
    if (isLoading) {
        return <div>Loading... </div>; // Loading indicator
    }
    return(
        <div>
           
           {(User.Verified === 'Verified' || User.Verified === 'Pending') && <PostsList posts={posts} />}
           {(User.Verified === 'Rejected' || !User.Verified) && <h1>{t('BlogsError')}</h1>}
        </div>
    )
}