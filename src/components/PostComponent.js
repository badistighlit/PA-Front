import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Input } from 'reactstrap';
import { executeFile, createLike, createComment, AllLikesForFile, AllCommentForFile } from '../API requests/Get';
import { useAuth0 } from '@auth0/auth0-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
const decodeBase64 = (base64String) => {
  try {
    return atob(base64String); 
  } catch (error) {
    //console.error("Error decoding Base64:", error);
    return "Invalid Base64 content";
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

const CommentsSection = styled.div`
  margin-top: 20px;
`;

const Comment = styled.div`
  margin-top: 10px;
  padding: 10px;
  border-top: 1px solid #ddd;
`;

// Composant principal
const PostComponent = ({ post }) => {
  const { user } = useAuth0();
  const [executionResult, setExecutionResult] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    const fetchLikesAndComments = async () => {
      try {
        const likesData = await AllLikesForFile(post.id_file);
        const commentsData = await AllCommentForFile(post.id_file);
        setLikes(likesData.length);
        setHasLiked(likesData.some(like => like.id_user === user.nickname));
        setComments(commentsData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
      } catch (error) {
        console.error("Error fetching likes or comments:", error);
      }
    };

    fetchLikesAndComments();
  }, [post.id_file, user.nickname]);

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

  // Fonction pour liker le fichier
  const handleLike = async () => {
    if (hasLiked) return;

    try {
      await createLike({ id_file: post.id_file, id_user: user.nickname });
      setLikes(likes + 1); // Mise à jour optimiste du nombre de likes
      setHasLiked(true);
    } catch (error) {
      console.error("Error liking file:", error);
    }
  };

  // Fonction pour ajouter un commentaire
  const handleComment = async () => {
    try {
      await createComment({ id_file: post.id_file, comment: commentText, id_user: user.nickname });
      setComments([...comments, { comment_content: commentText, id_user: user.nickname, created_at: new Date() }]); // Mise à jour optimiste de la liste des commentaires
      setCommentText(""); // Réinitialiser le champ de texte du commentaire
    } catch (error) {
      console.error("Error commenting on file:", error);
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
        <SyntaxHighlighter language={post.file_language} style={atomDark}>
          {decodeBase64(post.fileContent)}
        </SyntaxHighlighter>
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
      <div>
        <Button color="secondary" onClick={handleLike} style={{ backgroundColor: hasLiked ? 'red' : '' }}>
          Like ({likes})
        </Button>
      </div>
      <CommentsSection>
        <h5>Commentaires:</h5>
        {comments.map((comment, index) => (
          <Comment key={index}>
            <p><strong>{comment.id_user}:</strong> {comment.comment_content}</p>
          </Comment>
        ))}
        <Input
          type="textarea"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Ajouter un commentaire..."
        />
        <Button color="primary" onClick={handleComment} disabled={!commentText}>
          Ajouter un commentaire
        </Button>
      </CommentsSection>
    </PostContainer>
  );
};

export default PostComponent;
