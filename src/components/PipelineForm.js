import React, { useState, useEffect } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Button, FormGroup, Label, Input, Col, Row, FormText } from 'reactstrap';
import styled from 'styled-components';
import { useAuth0 } from '@auth0/auth0-react';
import { executePipeLine, getAllFilesForUser } from '../API requests/Get'; // Import the necessary API functions

// Composants stylisés
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

const PipelineForm = () => {
  const { user } = useAuth0();
  const [scripts, setScripts] = useState([]);

  useEffect(() => {
    const fetchScripts = async () => {
      try {
        const data = await getAllFilesForUser(user.nickname);
        setScripts(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des scripts', error);
      }
    };

    fetchScripts();
  }, [user]);

  const validationSchema = Yup.object({
    selectedScripts: Yup.array().of(
      Yup.object().shape({
        scriptId: Yup.number().required('Le script est requis'),
      })
    ).min(1, 'Au moins un script doit être sélectionné'),
    inputFile: Yup.mixed().required('Le fichier d\'entrée est requis'),
  });

  const onSubmit = async (values) => {
    console.log('Form values:', values);
    try {
      const formData = new FormData();
      const scriptsId = values.selectedScripts.map(script => script.scriptId);
  
      formData.append('scriptsId', JSON.stringify(scriptsId));
      formData.append('id_user', user.nickname);
      formData.append('file', values.inputFile);
  
      const response = await executePipeLine(formData);
  
      if (response) {
        console.log('Pipeline executed successfully:', response);
        // Handle success (e.g., display results)
      } else {
        console.error('Error executing the pipeline');
      }
    } catch (error) {
      console.error('Error executing the pipeline', error);
    }
  };
  
  const onDrop = (acceptedFiles, setFieldValue) => {
    setFieldValue('inputFile', acceptedFiles[0]);
  };

  return (
    <FormContainer>
      <Formik
        initialValues={{
          selectedScripts: [],
          inputFile: null,
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, handleChange, handleBlur, setFieldValue }) => (
          <Form method='POST'>
            <FieldArray name="selectedScripts">
              {({ insert, remove, push }) => (
                <div>
                  <Button type="button" color="primary" onClick={() => push({ scriptId: '' })}>
                    Ajouter un script
                  </Button>
                  {values.selectedScripts.length > 0 &&
                    values.selectedScripts.map((selectedScript, index) => (
                      <div key={index}>
                        <Row form>
                          <Col md={8}>
                            <FormGroup>
                              <Label for={`selectedScripts[${index}].scriptId`}>Script</Label>
                              <Input
                                type="select"
                                name={`selectedScripts[${index}].scriptId`}
                                id={`selectedScripts[${index}].scriptId`}
                                value={selectedScript.scriptId}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              >
                                <option value="">Sélectionnez un script</option>
                                {scripts.map(script => (
                                  <option key={script.id_file} value={script.id_file}>
                                    {script.tags}
                                  </option>
                                ))}
                              </Input>
                              {values.selectedScripts[index]?.scriptId && (
                                <FormText color="danger">
                                  {values.selectedScripts[index].scriptId}
                                </FormText>
                              )}
                            </FormGroup>
                          </Col>
                          <Col md={2}>
                            <Button
                              type="button"
                              color="danger"
                              onClick={() => remove(index)}
                              style={{ marginTop: '30px' }}
                            >
                              Supprimer
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    ))}
                </div>
              )}
            </FieldArray>

            <FormGroup>
              <Label for="inputFile">Fichier d'entrée</Label>
              <DropzoneContainer>
                <input
                  type="file"
                  onChange={(event) => onDrop(event.currentTarget.files, setFieldValue)}
                />
                {values.inputFile ? (
                  <p>{values.inputFile.name}</p>
                ) : (
                  <p>Glissez-déposez un fichier ici, ou cliquez pour sélectionner un fichier</p>
                )}
              </DropzoneContainer>
              {values.inputFile && (
                <FormText color="danger">
                  {values.inputFile.name}
                </FormText>
              )}
            </FormGroup>

            <FormGroup row>
              <Col sm={{ size: 10, offset: 2 }}>
                <Button type="submit" color="primary">Exécuter le pipeline</Button>
              </Col>
            </FormGroup>
          </Form>
        )}
      </Formik>
    </FormContainer>
  );
};

export default PipelineForm;
