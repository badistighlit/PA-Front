// src/components/PostComponent.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from 'reactstrap'; // Utilisation de Reactstrap pour le bouton
import { executeFile } from '../API requests/Get'; // Assure-toi que cette fonction existe dans api.js

// Décodage Base64
const decodeBase64 = (base64String) => {
  try {
    return atob(base64String); // Décodage de la chaîne Base64
  } catch (error) {
    console.error("Error decoding Base64:", error);
    return "Invalid Base64 content"; // Retourne un message d'erreur si le décodage échoue
  }
};

// Composants stylisés
const PostContainer = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const AuthorAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const AuthorName = styled.div`
  font-weight: bold;
`;

const PostDetails = styled.div`
  margin-bottom: 10px;
  color: #666;
  font-size: 12px;
`;

const PostContent = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #333;
`;

const ExecutionResult = styled.div`
  margin-top: 20px;
  background: #f4f4f4;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  font-size: 14px;
  color: #333;
`;

// Composant principal
const PostComponent = ({ post }) => {
  const [executionResult, setExecutionResult] = useState(null);
  const [executing, setExecuting] = useState(false);

  // Fonction pour exécuter le fichier
  const handleExecute = async () => {
    setExecuting(true);
    setExecutionResult("Exécution en cours...");

    try {
      const result = await executeFile(post.id_file);
      setExecutionResult(result);
    } catch (error) {
      console.error("Error executing file:", error);
      setExecutionResult("Erreur lors de l'exécution du fichier.");
    } finally {
      setExecuting(false);
    }
  };

  return (
    <PostContainer>
      <PostHeader>
        <AuthorAvatar src={`https://www.gravatar.com/avatar/${post.id_user}?d=identicon`} alt={`${post.id_user}`} />
        <AuthorName>{post.id_user}</AuthorName>
      </PostHeader>
      <PostDetails>
        <div><strong>Nom du fichier:</strong> {post.file_name}</div>
        {post.file_language && <div><strong>Langage:</strong> {post.file_language}</div>}
        <div><strong>Date de création:</strong> {new Date(post.created_at).toLocaleString()}</div>
        {post.tags && <div><strong>Tags:</strong> {post.tags}</div>}
      </PostDetails>
      <PostContent>
        <pre>{decodeBase64(post.fileContent)}</pre>
      </PostContent>
      <Button color="primary" onClick={handleExecute} disabled={executing}>
        {executing ? "Exécution..." : "Exécuter"}
      </Button>
      {executionResult && (
        <ExecutionResult>
          <h5>Résultat de l'exécution:</h5>
          <pre>{executionResult}</pre>
        </ExecutionResult>
      )}
    </PostContainer>
  );
};

export default PostComponent;
