import React from 'react';
import CreateScriptForm from '../components/CreateScriptForm.js';
import { useAuth0 } from '@auth0/auth0-react';

const CreateScriptPage = () => {
  const { isAuthenticated } = useAuth0();
  return (
    <div>
      <h1>Créer un nouveau script</h1>
      {isAuthenticated &&  <CreateScriptForm />}
    </div>
  );
};

export default CreateScriptPage;
