import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Input } from 'reactstrap';
import { executeFile, createLike, deleteLike, createComment, AllLikesForFile, AllCommentForFile, deleteComment, saveScript, unSaveScript, getSavedScripts } from '../API requests/Get';
import { useAuth0 } from '@auth0/auth0-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getCommunity, getCommunitiesOfUser, getFeedCommunity } from '../API requests/Get';
import { Link } from 'react-router-dom'; // Importez Link pour la navigation

const decodeBase64 = (base64String) => {
  try {
    return atob(base64String);
  } catch (error) {
    return "";
  }
};

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
  cursor: pointer; /* Ajoutez un curseur pointer pour indiquer la cliquabilité */
`;

const AuthorName = styled.div`
  font-weight: bold;
  position: relative;
  cursor: pointer; /* Ajoutez un curseur pointer pour indiquer la cliquabilité */

  &::after {
    content: '→';
    position: absolute;
    right: -20px; /* Ajustez la position de la flèche */
    font-size: 24px;
    color: #333;
  }
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
  position: relative;
`;

const DeleteButton = styled(Button)`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const CommunityArrow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 10px;
  font-size: 14px;
  color: #333;
  
  &::before {
    content: '→';
    font-size: 24px;
    margin-right: 8px;
  }
`;

const PostComponent = ({ post, onPostDelete }) => {
  const { user } = useAuth0();
  const [executionResult, setExecutionResult] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [hasLiked, setHasLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [communityName, setCommunityName] = useState(null);

  useEffect(() => {
    const fetchLikesAndCommentsAndFavorites = async () => {
      try {
        const likesData = await AllLikesForFile(post.id_file);
        const commentsData = await AllCommentForFile(post.id_file);
        const favoritesData = await getSavedScripts(user.sub);

        setLikes(likesData.length);
        setHasLiked(likesData.some(like => like.id_user === user.nickname));
        setComments(commentsData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
        setIsFavorite(favoritesData.some(script => script.id_file === post.id_file));
      } catch (error) {
        console.error("Error fetching likes, comments, or favorites:", error);
      }
    };

    const fetchCommunities = async () => {
      try {
        const communitiesData = await getCommunitiesOfUser(user.sub);
        
        for (const community of communitiesData) {
          const filesData = await getFeedCommunity(community.id_community);
          const name = await getCommunity(community.id_community);
          const flated = filesData.flat();

          if (flated.some(file => file.id_file === post.id_file)) {
            setCommunityName(name[0].name);
            break;
          }
        }
      } catch (error) {
        console.error("Error fetching communities or community info:", error);
      }
    };

    fetchLikesAndCommentsAndFavorites();
    fetchCommunities();
  }, [post.id_file, user.nickname, user.sub]);

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

  const handleLikeToggle = async () => {
    try {
      if (hasLiked) {
        await deleteLike(user.nickname, post.id_file);
        setLikes(likes - 1);
        setHasLiked(false);
      } else {
        await createLike({ id_file: post.id_file, id_user: user.sub, user_nickname: user.nickname });
        setLikes(likes + 1);
        setHasLiked(true);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleComment = async () => {
    try {
      await createComment({ id_file: post.id_file, comment: commentText, id_user: user.sub, user_nickname: user.nickname });
      const commentsData = await AllCommentForFile(post.id_file);
      setComments(commentsData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
      setCommentText("");
    } catch (error) {
      console.error("Error commenting on file:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      const commentsData = await AllCommentForFile(post.id_file);
      setComments(commentsData.filter(comment => comment.id_comment !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleDeletePost = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce post?")) {
      onPostDelete(post.id_file);
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorite) {
        if (window.confirm("Êtes-vous sûr de vouloir retirer ce script de vos favoris?")) {
          await unSaveScript(post.id_file, user.sub);
          setIsFavorite(false);
          alert("Script retiré des favoris avec succès.");
        }
      } else {
        await saveScript(post.id_file, user.sub);
        setIsFavorite(true);
        alert("Script ajouté aux favoris avec succès.");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Erreur lors du changement de favori.");
    }
  };

  return (
    <PostContainer>
      <PostHeader>
        <Link to={`/profileOf/${post.id_user}`}>
          <AuthorAvatar src={`https://www.gravatar.com/avatar/${post.id_user}?d=identicon`} alt={`${post.id_user}`} />
        </Link>
        <Link to={`/profileOf/${post.id_user}`}>
          <AuthorName>{post.user_nickname}</AuthorName>
        </Link>
        {communityName && (
          <CommunityArrow>
            publié sur : {communityName}
          </CommunityArrow>
        )}
      </PostHeader>
      <PostDetails>
        <div><strong>Nom du fichier:</strong> {post.file_name}</div>
        {post.file_language && <div><strong>Langage:</strong> {post.file_language}</div>}
        <div><strong>Date de création:</strong> {new Date(post.created_at).toLocaleString()}</div>
        {post.tags && <div><strong>Tags:</strong> {post.tags}</div>}
        {post.file_content && <div><strong>Description:</strong> {post.file_content}</div>}
      </PostDetails>
      {post.fileContent && post.fileContent !== "indisponible" && post.fileContent !== "content fichier endommagé" && post.fileContent !== "" && (
        <PostContent>
          <SyntaxHighlighter language={post.file_language} style={atomDark}>
            {decodeBase64(post.fileContent)}
          </SyntaxHighlighter>
        </PostContent>
      )}
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
        <Button color="secondary" onClick={handleLikeToggle} style={{ backgroundColor: hasLiked ? 'red' : '' }}>
          {hasLiked ? "Unlike" : "Like"} ({likes})
        </Button>
        {user.sub !== post.id_user && (
          <Button color="warning" onClick={handleFavoriteToggle} style={{ marginLeft: '10px', backgroundColor: isFavorite ? 'gold' : '' }}>
            {isFavorite ? "Favori" : "Ajouter aux favoris"}
          </Button>
        )}
      </div>
      <CommentsSection>
        <h5>Commentaires:</h5>
        {comments.map((comment, index) => (
          <Comment key={index}>
            <p><strong>{comment.user_nickname}:</strong> {comment.comment_content}</p>
            {user.sub === comment.id_user && (
              <DeleteButton color="danger" onClick={() => handleDeleteComment(comment.id_comment)}>
                Supprimer
              </DeleteButton>
            )}
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

      {user.sub === post.id_user && (
        <Button color="danger" onClick={handleDeletePost}>
          Supprimer le post
        </Button>
      )}
    </PostContainer>
  );
};

export default PostComponent;
