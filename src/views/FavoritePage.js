import React, { useState, useEffect } from 'react';
import { Spinner, Alert } from 'reactstrap';
import PostComponent from '../components/PostComponent';
import { getSavedScripts } from '../API requests/Get';
import { useAuth0 } from '@auth0/auth0-react';

const FavoritesPage = () => {
  const { user } = useAuth0();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await getSavedScripts(user.sub);
        setFavorites(data);
      } catch (error) {
        setError('Erreur lors de la récupération des scripts favoris');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user.sub]);

  if (loading) {
    return <Spinner color="primary">Chargement des scripts favoris...</Spinner>;
  }

  if (error) {
    return <Alert color="danger">{error}</Alert>;
  }

  const handlePostDelete = (id_file) => {
    // Fonction pour gérer la suppression d'un post
    setFavorites(favorites.filter(post => post.id_file !== id_file));
  };

  return (
    <div>
      <h1>Scripts Favoris</h1>
      {favorites.length === 0 ? (
        <p>Aucun script favori trouvé.</p>
      ) : (
        <div>
          {favorites.map((post) => (
            <PostComponent key={post.id_file} post={post} onPostDelete={handlePostDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
