import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, CardTitle, CardText } from "reactstrap";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import ProfileFeedComponent from "../components/ProfileFeedComponent";
import { getUserFollowers, getUserFollowing } from "../API requests/Get.js";
import styled from 'styled-components';

// Style personnalisé pour la carte d'informations de l'utilisateur
const UserInfoCard = styled(Card)`
  margin-bottom: 20px;
  background-color: #000;  // Fond noir
  color: #fff;  // Texte blanc
  padding: 20px;  // Ajoute du padding pour un meilleur aspect
`;

const CardTitleStyled = styled(CardTitle)`
  color: #00ff00;  // Intitulés en vert
  margin-bottom: 15px;  // Espace sous le titre
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;  // Espace entre les lignes
  padding: 5px;  // Padding interne
  background-color: #1c1c1c;  // Fond légèrement plus clair pour les lignes
  border-radius: 5px;  // Coins arrondis pour les lignes
`;

const InfoLabel = styled.span`
  color: #00ff00;  // Intitulés en vert
  font-weight: bold;
`;

const InfoValue = styled.span`
  color: #fff;  // Valeurs en blanc
`;

const UserProfilePage = () => {
  const { user } = useAuth0();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowersAndFollowing = async () => {
      try {
        const followersData = await getUserFollowers(user.sub);
        const followingData = await getUserFollowing(user.sub);
        setFollowers(followersData);
        setFollowing(followingData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowersAndFollowing();
  }, [user.nickname]);

  if (loading) return <Loading />;
  if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <Container className="mb-5">
      <Row className="align-items-center profile-header mb-5 text-center text-md-left">
        <Col md={2}>
          <img
            src={user.picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
          />
        </Col>
        <Col md>
          <h2>{user.name}</h2>
          <p className="lead text-muted">{user.email}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <UserInfoCard>
            <CardBody>
              <CardTitleStyled tag="h5">User Information</CardTitleStyled>
              <InfoRow>
                <InfoLabel>Given Name:</InfoLabel>
                <InfoValue>{user.given_name}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Family Name:</InfoLabel>
                <InfoValue>{user.family_name}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Nickname:</InfoLabel>
                <InfoValue>{user.nickname}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Name:</InfoLabel>
                <InfoValue>{user.name}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Email:</InfoLabel>
                <InfoValue>{user.email}</InfoValue>
              </InfoRow>
            </CardBody>
          </UserInfoCard>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Followers:</h3>
          <ul className="list-unstyled">
            {followers.map(follower => (
              <li key={follower.nickname} className="d-flex align-items-center mb-2">
                <img
                  src={follower.picture}
                  alt={follower.nickname}
                  className="rounded-circle mr-2"
                  style={{ width: '40px', height: '40px' }}
                />
                <span>{follower.nickname}</span>
              </li>
            ))}
          </ul>
        </Col>
        <Col>
          <h3>Following:</h3>
          <ul className="list-unstyled">
            {following.map(followingUser => (
              <li key={followingUser.nickname} className="d-flex align-items-center mb-2">
                <img
                  src={followingUser.picture}
                  alt={followingUser.nickname}
                  className="rounded-circle mr-2"
                  style={{ width: '40px', height: '40px' }}
                />
                <span>{followingUser.nickname}</span>
              </li>
            ))}
          </ul>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Mes Fichiers:</h3>
          <ProfileFeedComponent userId={user.sub} />
        </Col>
      </Row>
    </Container>
  );
};

export default withAuthenticationRequired(UserProfilePage, {
  onRedirecting: () => <Loading />,
});
