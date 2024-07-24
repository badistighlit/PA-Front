import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFeedCommunity } from '../API requests/Get';
import CreateScriptForm from '../components/CreateScriptForm';
import PostComponent from '../components/PostComponent';

const CommunityDetails = () => {
  const { id } = useParams(); // Récupère l'ID de la communauté depuis les paramètres de la route
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false); // État pour afficher/masquer le formulaire

  const fetchPosts = async () => {
    try {
      console.log("community id : " + id);
      const data = await getFeedCommunity(id); // Utilise l'ID pour récupérer les posts

      // Si vos données sont un tableau de tableaux, vous devez les aplatir
      const flattenedData = data.flat();

      // Trier les posts par date de création du plus récent au plus ancien
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
    if (id) { // Vérifie que l'ID est défini avant de faire la demande
      fetchPosts();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Community Details</h1>
      
      {/* Bouton pour afficher/masquer le formulaire */}
      <button onClick={() => setShowForm(prev => !prev)}>
        {showForm ? 'Cancel' : 'New Script'}
      </button>

      {/* Affichage conditionnel du formulaire */}
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
