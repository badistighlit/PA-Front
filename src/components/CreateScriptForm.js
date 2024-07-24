import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Form, FormGroup, Label, Input, Col, Alert } from 'reactstrap';
import { useAuth0 } from "@auth0/auth0-react";
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const FormContainer = styled.div`
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
`;

const DropzoneContainer = styled.div`
  border: 2px dashed #007bff;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  margin-bottom: 15px;
  background: #f4f4f4;
`;

const CreateScriptForm = ({ idCommunity, onSuccess }) => {
  const { user } = useAuth0();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' ou 'error'

  // Log pour vérifier si idCommunity est bien passé
  useEffect(() => {
    console.log("idCommunity dans CreateScriptForm:", idCommunity);
  }, [idCommunity]);

  const formik = useFormik({
    initialValues: {
      fileName: '',
      isScript: false,
      scriptLanguage: '',
      takesInput: false,
      inputType: '',
      tags: '',
    },
    validationSchema: Yup.object({
      fileName: Yup.string().required('Le nom du fichier est requis'),
      isScript: Yup.boolean(),
      scriptLanguage: Yup.string().test(
        'scriptLanguageRequired',
        'Le langage de script est requis',
        function (value) {
          return !this.parent.isScript || (this.parent.isScript && !!value);
        }
      ),
      inputType: Yup.string().test(
        'inputTypeRequired',
        'Le type d\'entrée est requis',
        function (value) {
          return !this.parent.takesInput || (this.parent.takesInput && !!value);
        }
      ),
      tags: Yup.string(),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('id_user', user.sub);
      formData.append('file_language', values.scriptLanguage);
      formData.append('tags', values.tags);
      formData.append('is_script', values.isScript);
      formData.append('type_input', values.takesInput ? values.inputType : 'null');
      formData.append('user_nickname', user.nickname);
      if (uploadedFile) {
        formData.append('file', uploadedFile);
      } else {
        setMessage('Aucun fichier sélectionné');
        setMessageType('error');
        return;
      }

      try {
        const config = {
          method: 'post',
          url: idCommunity ? `https://code-n-share-api-files.vercel.app/PostOnCommunity/${idCommunity}` : 'https://code-n-share-api-files.vercel.app/CreateFile',
          headers: { 
            'Content-Type': 'multipart/form-data'
          },
          data: formData,
        };
        console.log("url"+config.url)

        const response = await axios.request(config);

        if (response.data) {
          setMessage(idCommunity ? 'Publication dans la communauté réussie !' : 'Fichier créé avec succès !');
          setMessageType('success');
          formik.resetForm(); // Réinitialise le formulaire
          setUploadedFile(null); // Réinitialise le fichier uploadé
          if (onSuccess) onSuccess(); // Appel de la fonction de rappel après succès
        } else {
          throw new Error('Erreur lors de la création du fichier');
        }
      } catch (error) {
        console.error('Erreur lors de la création ou publication', error);
        setMessage('Erreur réseau ou autre');
        setMessageType('error');
      }
    },
  });

  const onDrop = (acceptedFiles) => {
    setUploadedFile(acceptedFiles[0]);
    console.log('Accepted File:', acceptedFiles[0]); // Vérification du fichier accepté
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <FormContainer>
      <Form onSubmit={formik.handleSubmit}>
        {message && (
          <Alert color={messageType === 'success' ? 'success' : 'danger'}>
            {message}
          </Alert>
        )}

        <FormGroup row>
          <Label for="fileName" sm={2}>Nom du fichier</Label>
          <Col sm={10}>
            <Input
              type="text"
              name="fileName"
              id="fileName"
              placeholder="Entrez le nom du fichier"
              value={formik.values.fileName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.fileName && formik.errors.fileName ? (
              <div className="text-danger">{formik.errors.fileName}</div>
            ) : null}
          </Col>
        </FormGroup>

        <FormGroup row>
          <Label sm={2}>Fichier</Label>
          <Col sm={10}>
            <DropzoneContainer {...getRootProps()}>
              <input {...getInputProps()} />
              {uploadedFile ? (
                <p>{uploadedFile.name}</p>
              ) : (
                <p>Glissez-déposez un fichier ici, ou cliquez pour sélectionner un fichier</p>
              )}
            </DropzoneContainer>
          </Col>
        </FormGroup>

        <FormGroup row check>
          <Label check sm={{ size: 10, offset: 2 }}>
            <Input
              type="checkbox"
              name="isScript"
              checked={formik.values.isScript}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            Est-ce un script ?
          </Label>
        </FormGroup>

        {formik.values.isScript && (
          <FormGroup row>
            <Label for="scriptLanguage" sm={2}>Langage</Label>
            <Col sm={10}>
              <Input
                type="select"
                name="scriptLanguage"
                id="scriptLanguage"
                value={formik.values.scriptLanguage}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Sélectionnez un langage</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
              </Input>
              {formik.touched.scriptLanguage && formik.errors.scriptLanguage ? (
                <div className="text-danger">{formik.errors.scriptLanguage}</div>
              ) : null}
            </Col>
          </FormGroup>
        )}

        <FormGroup row check>
          <Label check sm={{ size: 10, offset: 2 }}>
            <Input
              type="checkbox"
              name="takesInput"
              checked={formik.values.takesInput}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            Le fichier prend-il des entrées ?
          </Label>
        </FormGroup>

        {formik.values.takesInput && (
          <FormGroup row>
            <Label for="inputType" sm={2}>Type d'entrée</Label>
            <Col sm={10}>
              <Input
                type="text"
                name="inputType"
                id="inputType"
                placeholder="Entrez le type d'entrée"
                value={formik.values.inputType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.inputType && formik.errors.inputType ? (
                <div className="text-danger">{formik.errors.inputType}</div>
              ) : null}
            </Col>
          </FormGroup>
        )}

        <FormGroup row>
          <Label for="tags" sm={2}>Tags</Label>
          <Col sm={10}>
            <Input
              type="text"
              name="tags"
              id="tags"
              placeholder="Entrez des tags"
              value={formik.values.tags}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Col>
        </FormGroup>

        <FormGroup row>
          <Col sm={{ size: 10, offset: 2 }}>
            <Button type="submit" color="primary">Créer</Button>
          </Col>
        </FormGroup>
      </Form>
    </FormContainer>
  );
};

export default CreateScriptForm;
