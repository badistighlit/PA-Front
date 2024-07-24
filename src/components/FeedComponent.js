// src/components/FeedComponent.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getFeedForUser } from '../API requests/Get';
import PostComponent from './PostComponent';
import { useAuth0 } from "@auth0/auth0-react"; 

const FeedContainer = styled.div`
  flex: 3;
  padding-right: 20px;
`;


const FeedComponent = () => {
  const [posts, setPosts] = useState([]);
  const { user } = useAuth0();
 
  const username =user.sub;
  useEffect(() => {
    const fetchFeed = async () => {
      try {

        const feedData = await getFeedForUser(username);
        console.log(feedData)
        const sortedFeedData = feedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setPosts(sortedFeedData);
      } catch (error) {
        console.error('Error fetching the feed:', error);
      }
    };

    fetchFeed();
  }, [username]);

  return (
    <FeedContainer>
      {posts.map(post => (
        <PostComponent key={post.id} post={post} />
      ))}
    </FeedContainer>
  );
};

export default FeedComponent;
