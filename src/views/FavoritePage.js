import React, { useState, useEffect } from 'react';
import { Spinner, Alert, CardTitle } from 'reactstrap';  
import PostComponent from '../components/PostComponent';
import { getSavedScripts } from '../API requests/Get';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin-top: 20px;
`;

const ErrorContainer = styled.div`
  margin: 20px;
`;

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
    return (
      <LoadingContainer>
        <Spinner color="primary" />
        <CardTitle tag="h5">Chargement...</CardTitle>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <Alert color="danger">{error}</Alert>
      </ErrorContainer>
    );
  }

  const handlePostDelete = (id_file) => {
    setFavorites(favorites.filter(post => post.id_file !== id_file));
  };

  return (
    <div style={{ margin: '20px' }}>
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
