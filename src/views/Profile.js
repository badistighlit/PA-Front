import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import Highlight from "../components/Highlight";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getAllFilesForUser,executeFile } from "../API requests/Get.js";

// Exemple de fonction simulateur d'exécution de fichier
// Remplacez cette fonction par l'appel réel à votre API d'exécution


export const ProfileComponent = () => {
  const { user } = useAuth0(); // Utilisation du hook Auth0 pour obtenir les informations utilisateur
  const [files, setFiles] = useState([]); // État pour les fichiers, initialisé à un tableau vide
  const [loading, setLoading] = useState(true); // État pour le chargement
  const [error, setError] = useState(null); // État pour les erreurs
  const [executionResults, setExecutionResults] = useState({}); // État pour les résultats d'exécution

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await getAllFilesForUser("badis.tighlit"); // Appel API pour obtenir les fichiers
        setFiles(data); // Mise à jour de l'état des fichiers
      } catch (error) {
        setError(error); // Gestion des erreurs
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchFiles(); // Appel de la fonction asynchrone
  }, []); // Le tableau vide signifie que useEffect s'exécute uniquement après le montage

  if (loading) return <Loading />; // Affichage du chargement
  if (error) return <p>Error loading files: {error.message}</p>; // Affichage de l'erreur s'il y en a une

  // Fonction pour décoder le contenu Base64
  const decodeBase64 = (base64String) => {
    try {
      return atob(base64String); // Décodage de la chaîne Base64
    } catch (error) {
      console.error("Error decoding Base64:", error);
      return "Invalid Base64 content"; // Retourne un message d'erreur si le décodage échoue
    }
  };

  // Fonction pour gérer l'exécution du fichier
  const handleExecuteFile = async (fileId) => {
    setExecutionResults((prevResults) => ({
      ...prevResults,
      [fileId]: "Executing...", // Affiche un message de chargement avant l'exécution
    }));

    try {
      const result = await executeFile(fileId); // Exécuter le fichier en utilisant son ID
      setExecutionResults((prevResults) => ({
        ...prevResults,
        [fileId]: result, // Mettre à jour le résultat de l'exécution
      }));
    } catch (error) {
      console.error("Error executing file:", error);
      setExecutionResults((prevResults) => ({
        ...prevResults,
        [fileId]: "Error executing file", // Mettre à jour l'état en cas d'erreur
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

// Utilisation de withAuthenticationRequired pour protéger le composant par l'authentification
export default withAuthenticationRequired(ProfileComponent, {
  onRedirecting: () => <Loading />,
});
