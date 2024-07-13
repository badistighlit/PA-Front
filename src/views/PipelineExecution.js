import React from 'react';
import PipelineForm from '../components/PipelineForm.js';
import { useAuth0 } from '@auth0/auth0-react';

const PipelineExecution = () => {
  const { isAuthenticated } = useAuth0(); 

  return (
    <div>
      <h1>Pipeline</h1>
      {isAuthenticated ? ( 
        <PipelineForm />
      ) : (
        <p>Veuillez vous connecter pour accéder au formulaire de pipeline.</p> 
      )}
    </div>
  );
};

export default PipelineExecution;
