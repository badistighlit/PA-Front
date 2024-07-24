import axios from 'axios';

const authUrl = 'https://code-n-share-api-authentification.vercel.app/application_token';
const apiUrl = 'https://code-n-share-api-gateway.vercel.app';
const filesApi = 'https://code-n-share-api-files.vercel.app';

const instance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});


// Interceptor pour gérer les réponses et les erreurs
instance.interceptors.response.use(
  response => response,
  error => {
    console.error('API call error:', error);
    return Promise.reject(error);
  }
);

// Fonction pour obtenir le token d'authentification
const getAuthToken = async () => {
  try {
    const response = await instance.get(authUrl);
    return response.data.accessToken;
  } catch (error) {
    console.error('Error fetching auth token:', error);
    throw error;
  }
};

// Fonction générique pour configurer les headers avec le token
const getConfigWithToken = async () => {
  const token = await getAuthToken();
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// Fonctions API
export const getAllFilesForUser = async (username) => {
  try {
    const config = await getConfigWithToken();
    const response = await instance.get(`${apiUrl}/files/AllFilesForUser/${username}`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
};

export const getFileById = async (fileId) => {
  try {
    const config = await getConfigWithToken();
    const response = await instance.get(`${apiUrl}/files/FileById/${fileId}`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching files by id:', error);
    throw error;
  }
};

export const getFeedForUser = async (username) => {
  try {
    const config = await getConfigWithToken();
    const response = await instance.get(`${apiUrl}/files/FeedForUser/${username}`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching feed:', error);
    throw error;
  }
};

export const getUserFollowers = async (username) => {
  try {
    const config = await getConfigWithToken();
    const response = await instance.get(`${apiUrl}/followers/${username}/followers`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching followers:', error);
    throw error;
  }
};

export const getUserFollowing = async (username) => {
  try {
    const config = await getConfigWithToken();
    const response = await instance.get(`${apiUrl}/followers/${username}/following`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching following:', error);
    throw error;
  }
};


export const followUser = async (followerId, followedId, followerNickname, followedNickname) => {
  try {
    const config = await getConfigWithToken();
    const response = await instance.post(`${apiUrl}/createFollowing`, {
      id_user_follower: followerId,
      id_user_followed: followedId,
      user_nickname_follower: followerNickname,
      user_nickname_followed: followedNickname
    }, config);
    return response.data;
  } catch (error) {
    console.error('Error following user:', error);
    throw error;
  }
};

export const unfollowUser = async (followerId, followedId) => {
  try {
    const config = await getConfigWithToken();
    const response = await instance.post(`${apiUrl}/Unfollowing`, {
      id_user_follower: followerId,
      id_user_followed: followedId
    }, config);
    return response.data;
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw error;
  }
};
export const createFile = async (body) => {
  try {
    const config = await getConfigWithToken();
    const response = await instance.post(`${filesApi}/CreateFile`, body, config);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating file:', error);
    throw error;
  }
};

export const executeFile = async (fileId) => {
  try {
    const config = await getConfigWithToken();
    const response = await instance.get(`https://code-n-share-api-files.vercel.app/executeFile/${fileId}`, config);
    console.log('Execution result:', response.data.result);
    return response.data.result;
  } catch (error) {
    console.error('Error executing file:', error);
    throw error;
  }
};

export const executePipeLine = async (formData) => {
  try {
    const token = await getAuthToken();
    const response = await instance.post(`http://localhost:4000/executePipeline`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('Execution result:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error executing Pipeline:', error);
    throw error;
  }
};

export const createLike = async (body) => {
  try {
    const config = await getConfigWithToken();
    const response = await instance.post(`${apiUrl}/files/CreateLike`, body, config);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error liking file:', error);
    throw error;
  }
};

export const AllLikesForFile = async (idFile) => {
  try {
    const config = await getConfigWithToken();
    const response = await instance.get(`${apiUrl}/files/AllLikesForFile/${idFile}`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching likes:', error);
    throw error;
  }
};

export const createComment = async (body) => {
  try {
    const config = await getConfigWithToken();
    const response = await instance.post(`${apiUrl}/files/CreateComment`, body, config);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error commenting file:', error);
    throw error;
  }
};

export const AllCommentForFile = async (idFile) => {
  try {
    const config = await getConfigWithToken();
    const response = await instance.get(`${apiUrl}/files/AllCommentsForFile/${idFile}`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const getPipelineResult = async (idJob) => {
  try {
    const config = await getConfigWithToken();
    const response = await instance.get(`${filesApi}/pipelineResult/${idJob}`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching results:', error);
    throw error;
  }
};



export const deleteLike = async (idUser, idFile) => {
  try {
    const config = await getConfigWithToken();
    const response = await instance.delete(`${apiUrl}/files/deleteLike/${idFile}/${idUser}`, config);
    return response.data;
  } catch (error) {
    console.error('Error deleting like:', error);
    throw error;
  }
};

export const deleteComment = async (idComment) => {
  try {
    const config = await getConfigWithToken();
    const response = await instance.delete(`${apiUrl}/files/deleteComment/${idComment}`, config);
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

export const saveScript = async (id_file, id_user) => {
  try {
    const config = await getConfigWithToken();
    const response = await instance.post(
      `${apiUrl}/files/saveScript`,
      { id_file, id_user },
      config
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors du saving script: ' + error.message);
    throw error;
  }
};
export const unSaveScript = async (id_file, id_user) => {
  try {
    const config = await getConfigWithToken();
    const response = await instance.delete(`${apiUrl}/files/saveScript`, {
      headers: config.headers,
      data: { id_file, id_user }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors du deleting script de saved: ' + error.message);
    throw error;
  }
};
export const getSavedScripts = async(id_user) =>{
  try{
    const config = await getConfigWithToken();
    const response = await instance.get(`${apiUrl}/files/savedScripts/${id_user}`,config)
    return response.data;
  
  }catch(error){
    console.error('erreurlors de recuperations des script'+ error.message)
    throw error
  }
  
  }

export const deleteFile = async (idFile) => {
  try {
    const config = await getConfigWithToken();
    const response = await instance.delete(`${apiUrl}/files/deleteFile/${idFile}`, config);
    return response.data;
  } catch (error) {
    console.error('Error deleting File:', error);
    throw error;
  }
};

export const createCommunity = async (id_user,name) => {
  try {
    const config = await getConfigWithToken();
    const response = await instance.post(`${filesApi}/CreateCommunity/${id_user}/${name}`, config);
    return response.data;
  } catch (error) {
    console.error('Error create community:', error);
    throw error;
  }
};
export const joinCommunity = async (id_user,id_community) => {
  try {
    const config = await getConfigWithToken();
    const response = await instance.post(`${filesApi}/JoinCommunity/${id_user}/${id_community}`, {},config);
    return response.data;
  } catch (error) {
    console.error('Error joining community:', error);
    throw error;
  }
};
export const unJoinCommunity = async (id_user,id_community) => {
  try {
    const config = await getConfigWithToken();
    const response = await instance.post(`${filesApi}/UnJoinCommunity/${id_user}/${id_community}`, config);
    return response.data;
  } catch (error) {
    console.error('Error unjoining community:', error);
    throw error;
  }
};

export const postOnCommunity = async (id_community,body) => {
  try {
    const config = await getConfigWithToken();
    const response = await instance.post(`${filesApi}/PostOnCommunity/${id_community}`,body, config);
    return response.data;
  } catch (error) {
    console.error('Error pushing on community:', error);
    throw error;
  }
};

export const getCommunities = async () => {
  try {
    const config = await getConfigWithToken();
    const response = await instance.get(`${filesApi}/AllCommunities`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching on communities:', error);
    throw error;
  }
};

export const getCommunity = async (id_community) => {
  try {
    const config = await getConfigWithToken();
    const response = await instance.get(`${filesApi}/CommunityInfos/${id_community}`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching on community:', error);
    throw error;
  }
};
export const getFeedCommunity = async (id_community) => {
  try {
    const config = await getConfigWithToken();
    const response = await instance.get(`${filesApi}/FilesForCommunity/${id_community}`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching on community:', error);
    throw error;
  }
};


export const getUsersOfCommunity= async (id_community) => {
  try {
    const config = await getConfigWithToken();
    const response = await instance.get(`${filesApi}/AllUsersCommunity/${id_community}`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching on users:', error);
    throw error;
  }
};

export const getCommunitiesOfUser= async (id_user) => {
  try {
    const config = await getConfigWithToken();
    const response = await instance.get(`${filesApi}/AllCommunitiesOfUser/${id_user}`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching on communities:', error);
    throw error;
  }
};



//USERS 


export const getUserById = async (userId) => {
  try {
    const config = await getConfigWithToken();
    const response = await axios.get(`https://code-n-share-api-authentification.vercel.app/user/${userId}`,config);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};


