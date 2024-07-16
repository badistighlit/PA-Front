import axios from 'axios';

const authUrl = 'https://code-n-share-api-authentification.vercel.app/application_token';
const apiUrl = 'https://code-n-share-api-gateway.vercel.app';
const filesApi = 'https://code-n-share-api-files.vercel.app'

// Fonction pour obtenir le token d'authentification
const getAuthToken = async () => {
  try {
    const response = await axios.get(authUrl);
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
    const response = await axios.get(`${apiUrl}/files/AllFilesForUser/${username}`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
};


export const getFileById = async (fileId)=> {
  try{
    const config = await getConfigWithToken();
    const response = await axios.get(`${apiUrl}/files/FileById/${fileId}`, config);
    return response.data;

  }
  catch(error){
    console.error('Error fetching files by id',error)
    throw error;
  }
}

export const getFeedForUser = async (username) => {
  try {
    const config = await getConfigWithToken();
    const response = await axios.get(`${apiUrl}/files/FeedForUser/${username}`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching feed:', error);
    throw error;
  }
};

export const getUserFollowers = async (username) => {
  try {
    const config = await getConfigWithToken();
    const response = await axios.get(`${apiUrl}/followers/${username}/followers`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching followers:', error);
    throw error;
  }
};

export const getUserFollowing = async (username) => {
  try {
    const config = await getConfigWithToken();
    const response = await axios.get(`${apiUrl}/followers/${username}/following`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching following:', error);
    throw error;
  }
};

export const createFile = async (body) => {
  try {
    const config = await getConfigWithToken();
    const response = await axios.post(`https://code-n-share-api-files.vercel.app/CreateFile`, body, config);
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
    const response = await axios.get(`https://code-n-share-api-files.vercel.app/executeFile/${fileId}`, config);
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

    const response = await axios.post(`${filesApi}/executePipeline`, formData, {
      headers: {

        'Content-Type': 'multipart/form-data',
       
      },
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
    const response = await axios.post(`${apiUrl}/files/CreateLike`, body, config);
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
    const response = await axios.get(`${apiUrl}/files/AllLikesForFile/${idFile}`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching likes:', error);
    throw error;
  }
};

export const createComment = async (body) => {
  try {
    const config = await getConfigWithToken();
    const response = await axios.post(`${apiUrl}/files/CreateComment`, body, config);
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
    const response = await axios.get(`${apiUrl}/files/AllCommentsForFile/${idFile}`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  } };

  export const getPipelineResult = async (idJob) => {
    try {
      const config = await getConfigWithToken();
      const response = await axios.get(`${apiUrl}/files/pipelineResult/${idJob}`, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }

};
