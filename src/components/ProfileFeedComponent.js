// src/components/ProfileFeedComponent.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAllFilesForUser } from '../API requests/Get'; // Assure-toi que le chemin est correct
import PostComponent from './PostComponent';
import { useAuth0 } from '@auth0/auth0-react';

const ProfileContainer = styled.div`
  flex: 3;
  padding-right: 20px;
`;

const ProfileFeedComponent = () => {
  const [posts, setPosts] = useState([]);
  const { user } = useAuth0();
 
  const username =user.nickname;
 
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await getAllFilesForUser(username);
        setPosts(data);
      } catch (error) {
        console.error('Error fetching the files:', error);
      }
    };

    fetchFiles();
  }, [username]);

  return (
    <ProfileContainer>
      {posts.map(post => (
        <PostComponent key={post.id} post={post} />
      ))}
    </ProfileContainer>
  );
};

export default ProfileFeedComponent;
