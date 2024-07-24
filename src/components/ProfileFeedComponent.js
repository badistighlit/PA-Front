// src/components/ProfileFeedComponent.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAllFilesForUser, deleteFile } from '../API requests/Get'; // Assure-toi que le chemin est correct
import PostComponent from './PostComponent';

const ProfileContainer = styled.div`
  flex: 3;
  padding-right: 20px;
`;

const ProfileFeedComponent = ({ userId }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        console.log(userId);
        const data = await getAllFilesForUser(userId);
        const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setPosts(sortedData);
      } catch (error) {
        console.error('Error fetching the files:', error);
      }
    };

    fetchFiles();
  }, [userId]);

  const handlePostDelete = async (postId) => {
    try {
      await deleteFile(postId);
      setPosts(posts.filter(post => post.id_file !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <ProfileContainer>
      {posts.map(post => (
        <PostComponent 
          key={post.id_file} 
          post={post} 
          onPostDelete={handlePostDelete} 
        />
      ))}
    </ProfileContainer>
  );
};

export default ProfileFeedComponent;
