// src/pages/OtherUserProfilePage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button } from "reactstrap";
import Highlight from "../components/Highlight";
import Loading from "../components/Loading";
import ProfileFeedComponent from "../components/ProfileFeedComponent";
import { getUserById, getUserFollowers, getUserFollowing, followUser, unfollowUser } from "../API requests/Get";
import { useAuth0 } from "@auth0/auth0-react";

const OtherUserProfilePage = () => {
  const { user } = useAuth0();
  const { userId } = useParams(); // Récupère l'ID de l'utilisateur à partir de l'URL
  const [profileUser, setProfileUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileData = await getUserById(userId);
        const followersData = await getUserFollowers(userId);
        const followingData = await getUserFollowing(userId);
        setProfileUser(profileData);
        setFollowers(followersData);
        setFollowing(followingData);
        setIsFollowing(followingData.some(followingUser => followingUser.id === user.sub));
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, user.sub]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(user.sub, userId);
        setIsFollowing(false);
      } else {
        await followUser(user.sub, userId, user.nickname, profileUser.nickname);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p>Error loading data: {error.message}</p>;

  if (!profileUser) return <p>User not found</p>;

  return (
    <Container className="mb-5">
      <Row className="align-items-center profile-header mb-5 text-center text-md-left">
        <Col md={2}>
          <img
            src={profileUser.picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
          />
        </Col>
        <Col md>
          <h2>{profileUser.name}</h2>
          <p className="lead text-muted">{profileUser.email}</p>
          {user.sub !== userId && (
            <Button color={isFollowing ? 'danger' : 'primary'} onClick={handleFollowToggle}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          )}
        </Col>
      </Row>
      <Row>
        <Highlight>{JSON.stringify(profileUser, null, 2)}</Highlight>
      </Row>
      <Row>
        <Col>
          <h3>Followers:</h3>
          <p>
            <a href={`/followers/${profileUser.nickname}`}>{followers.length}</a>
          </p>
        </Col>
        <Col>
          <h3>Following:</h3>
          <p>
            <a href={`/following/${profileUser.nickname}`}>{following.length}</a>
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Fichiers:</h3>
          <ProfileFeedComponent userId={userId} /> {/* Passe l'ID de l'autre utilisateur */}
        </Col>
      </Row>
    </Container>
  );
};

export default OtherUserProfilePage;
