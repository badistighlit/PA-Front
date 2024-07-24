import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCommunities, joinCommunity, getCommunitiesOfUser, createCommunity } from '../API requests/Get'; 
import { useAuth0 } from '@auth0/auth0-react';

const CommunitiesPage = () => {
  const { user, isLoading: authLoading } = useAuth0();
  const [communities, setCommunities] = useState([]);
  const [userCommunities, setUserCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(null);
  const [creating, setCreating] = useState(false); // State for creating a new community
  const [newCommunityName, setNewCommunityName] = useState(""); // State for new community name

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const [communityData, userCommunityData] = await Promise.all([
          getCommunities(),
          getCommunitiesOfUser(user.sub)
        ]);
        console.log('Community data:', communityData); // Debugging
        setCommunities(communityData);
        console.log('User communities:', userCommunityData); // Debugging
        setUserCommunities(userCommunityData.map(c => c.id_community));
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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Communities</h1>
      <button onClick={() => setCreating(!creating)}>
        {creating ? 'Cancel' : 'Create New Community'}
      </button>
      {creating && (
        <div>
          <input 
            type="text" 
            value={newCommunityName} 
            onChange={(e) => setNewCommunityName(e.target.value)} 
            placeholder="Community Name" 
          />
          <button onClick={handleCreateCommunity} disabled={!newCommunityName}>
            Create
          </button>
        </div>
      )}
      <ul>
        {communities.map((community) => (
          <li key={community.id}>
            <Link to={`/community/${community.id}`}>{community.name}</Link>
            {userCommunities.includes(community.id) ? (
              <button disabled>Already in this community</button>
            ) : (
              <button 
                onClick={() => handleJoinCommunity(community.id)}
                disabled={joining === community.id}
              >
                {joining === community.id ? 'Joining...' : 'Join'}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommunitiesPage;
