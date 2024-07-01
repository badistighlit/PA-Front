import React from 'react';
import { Container } from 'reactstrap';
import { useAuth0 } from '@auth0/auth0-react';
import FeedComponent from '../components/FeedComponent'; 


const Home = () => {
  const { isAuthenticated } = useAuth0(); 

  return (
    <Container>
      {isAuthenticated && <FeedComponent />}
    </Container>
  );
};

export default Home;
