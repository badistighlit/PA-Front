import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCommunities, joinCommunity, getCommunitiesOfUser, createCommunity, getUsersOfCommunity } from '../API requests/Get'; 
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import { Spinner, Alert, CardTitle } from 'reactstrap';  
const PageContainer = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
`;
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin-top: 20px;
`;
const CommunityList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const CommunityItem = styled.li`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CommunityName = styled.span`
  font-size: 18px;
  font-weight: bold;
`;

const Button = styled.button`
  background: ${(props) => (props.disabled ? '#ddd' : '#007bff')};
  color: ${(props) => (props.disabled ? '#666' : '#fff')};
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: background 0.3s ease;

  &:hover {
    background: ${(props) => (props.disabled ? '#ddd' : '#0056b3')};
  }
`;

const CommunitiesPage = () => {
  const { user, isLoading: authLoading } = useAuth0();
  const [communities, setCommunities] = useState([]);
  const [userCommunities, setUserCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(null);
  const [creating, setCreating] = useState(false); 
  const [newCommunityName, setNewCommunityName] = useState(""); 
  const [userCounts, setUserCounts] = useState({}); // Track user counts

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const [communityData, userCommunityData] = await Promise.all([
          getCommunities(),
          getCommunitiesOfUser(user.sub)
        ]);
        console.log('Community data:', communityData); 
        setCommunities(communityData);
        console.log('User communities:', userCommunityData);
        setUserCommunities(userCommunityData.map(c => c.id_community));

        // Fetch user counts for each community
        const counts = await Promise.all(
          communityData.map(async (community) => {
            const users = await getUsersOfCommunity(community.id);
            return { id: community.id, count: users.length };
          })
        );
        setUserCounts(counts.reduce((acc, { id, count }) => ({ ...acc, [id]: count }), {}));
      } catch (error) {
        console.error('Error fetching communities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [user.sub]);

  const handleJoinCommunity = async (id_community) => {
    setJoining(id_community);
    try {
      await joinCommunity(user.sub, id_community);
      alert('Successfully joined the community!');
      const userCommunityData = await getCommunitiesOfUser(user.sub);
      setUserCommunities(userCommunityData.map(c => c.id));
    } catch (error) {
      console.error('Error joining community:', error);
      alert('Failed to join the community.');
    } finally {
      setJoining(null);
    }
  };

  const handleCreateCommunity = async () => {
    setCreating(true);
    try {
      await createCommunity(user.sub, newCommunityName);
      alert('Community created successfully!');
      setNewCommunityName("");
      const communityData = await getCommunities();
      setCommunities(communityData);
    } catch (error) {
      console.error('Error creating community:', error);
      alert('Failed to create the community.');
    } finally {
      setCreating(false);
    }
  };

  if (authLoading || loading) {
    return      <LoadingContainer>
    <Spinner color="primary" />
    <CardTitle tag="h5">Chargement...</CardTitle>
  </LoadingContainer>
  }

  return (
    <PageContainer>
      <h1>Communities</h1>
      <Button onClick={() => setCreating(!creating)}>
        {creating ? 'Cancel' : 'Create New Community'}
      </Button>
      {creating && (
        <div style={{ marginTop: '20px' }}>
          <input 
            type="text" 
            value={newCommunityName} 
            onChange={(e) => setNewCommunityName(e.target.value)} 
            placeholder="Community Name" 
          />
          <Button onClick={handleCreateCommunity} disabled={!newCommunityName}>
            Create
          </Button>
        </div>
      )}
      <CommunityList>
        {communities.map((community) => (
          <CommunityItem key={community.id}>
            <CommunityName>
              <Link to={`/community/${community.id}`}>{community.name}</Link>
            </CommunityName>
            <span>{userCounts[community.id] || 0} users</span>
            {userCommunities.includes(community.id) ? (
              <Button disabled>Already in this community</Button>
            ) : (
              <Button 
                onClick={() => handleJoinCommunity(community.id)}
                disabled={joining === community.id}
              >
                {joining === community.id ? 'Joining...' : 'Join'}
              </Button>
            )}
          </CommunityItem>
        ))}
      </CommunityList>
    </PageContainer>
  );
};

export default CommunitiesPage;
