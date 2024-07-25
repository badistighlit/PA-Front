import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import Highlight from "../components/Highlight";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getAllFilesForUser, executeFile, getUserFollowers, getUserFollowing } from "../API requests/Get.js";



const ProfileComponent = () => {
  const { user } = useAuth0(); // Utilisation du hook Auth0 pour obtenir les informations utilisateur
  const [files, setFiles] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [executionResults, setExecutionResults] = useState({});
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filesData = await getAllFilesForUser(user.nickname); 
        setFiles(filesData); 
        const followersData = await getUserFollowers(user.nickname); 
        setFollowers(followersData); 

        const followingData = await getUserFollowing(user.nickname);
        setFollowing(followingData); 
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.nickname]);

  if (loading) return <Loading />;
  if (error) return <p>Error loading data: {error.message}</p>;


  const decodeBase64 = (base64String) => {
    try {
      return atob(base64String); 
    } catch (error) {
      console.error("Error decoding Base64:", error);
      return "Invalid Base64 content";
    }
  };


  const handleExecuteFile = async (fileId) => {
    setExecutionResults((prevResults) => ({
      ...prevResults,
      [fileId]: "Executing...", 
    }));

    try {
      const result = await executeFile(fileId); 
      setExecutionResults((prevResults) => ({
        ...prevResults,
        [fileId]: result, 
      }));
    } catch (error) {
      console.error("Error executing file:", error);
      setExecutionResults((prevResults) => ({
        ...prevResults,
        [fileId]: "Error executing file", 
      }));
    }
  };

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
            <a href={`/followers/${user.sub}`}>{followers.length}</a>
          </p>
        </Col>
        <Col>
          <h3>Following:</h3>
          <p>
            <a href={`/following/${user.sub}`}>{following.length}</a>
          </p>
        </Col>
      </Row>
      <Row>
        <h3>Files:</h3>
        {files.length > 0 ? (
          <ul>
            {files.map((file) => (
              <li key={file.id_file}>
                <h4>{file.file_name}</h4>
                <p>Language: {file.file_language}</p>
                <p>Created At: {new Date(file.created_at).toLocaleString()}</p>
                <p>Content:</p>
                <pre>{decodeBase64(file.fileContent)}</pre>
                <Button color="primary" onClick={() => handleExecuteFile(file.id_file)}>
                  Exécuter
                </Button>
                {executionResults[file.id_file] && (
                  <div>
                    <h5>Résultat de l'exécution:</h5>
                    <pre>{executionResults[file.id_file]}</pre>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No files found.</p>
        )}
      </Row>
    </Container>
  );
};


export default withAuthenticationRequired(ProfileComponent, {
  onRedirecting: () => <Loading />,
});
