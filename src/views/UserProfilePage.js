import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import Highlight from "../components/Highlight";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import ProfileFeedComponent from "../components/ProfileFeedComponent";
import { getUserFollowers, getUserFollowing } from "../API requests/Get.js";

const UserProfilePage = () => {
  const { user } = useAuth0();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowersAndFollowing = async () => {
      try {
        const followersData = await getUserFollowers(user.nickname);
        const followingData = await getUserFollowing(user.nickname);
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
        <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
      </Row>
      <Row>
        <Col>
          <h3>Followers:</h3>
          <p>
            <a href={`/followers/${user.nickname}`}>{followers.length}</a>
          </p>
        </Col>
        <Col>
          <h3>Following:</h3>
          <p>
            <a href={`/following/${user.nickname}`}>{following.length}</a>
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Mes Fichiers:</h3>
          <ProfileFeedComponent />
        </Col>
      </Row>

    </Container>
  );
};

export default withAuthenticationRequired(UserProfilePage, {
  onRedirecting: () => <Loading />,
});
