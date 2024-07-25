import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFeedCommunity } from '../API requests/Get';
import CreateScriptForm from '../components/CreateScriptForm';
import PostComponent from '../components/PostComponent';

const CommunityDetails = () => {
  const { id } = useParams(); 
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchPosts = async () => {
    try {
      console.log("community id : " + id);
      const data = await getFeedCommunity(id); 

     
      const flattenedData = data.flat();

   
      const sortedData = flattenedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setPosts(sortedData);
    } catch (error) {
      console.error('Error fetching posts for community:', error);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) { 
      fetchPosts();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Community Details</h1>
      
      {}
      <button onClick={() => setShowForm(prev => !prev)}>
        {showForm ? 'Cancel' : 'New Script'}
      </button>

      {}
      {showForm && <CreateScriptForm idCommunity={id} onSuccess={() => fetchPosts()} />}

      {posts.length ? (
        posts.map(post => <PostComponent key={post.id_file} post={post} />)
      ) : (
        <p>No posts available for this community.</p>
      )}
    </div>
  );
};

export default CommunityDetails;
