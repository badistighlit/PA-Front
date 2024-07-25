import React, { useState, useEffect } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Button, FormGroup, Label, Input, Col, Row, FormText, Spinner, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import styled from 'styled-components';
import { useAuth0 } from '@auth0/auth0-react';
import { executePipeLine, getAllFilesForUser, getPipelineResult, getFileById, getSavedScripts } from '../API requests/Get';

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

const ScriptResult = styled(Card)`
  margin-top: 20px;
`;

const PipelineForm = () => {
  const { user } = useAuth0();
  const [scripts, setScripts] = useState([]);
  const [filteredScripts, setFilteredScripts] = useState([]);
  const [jobId, setJobId] = useState(null);
  const [results, setResults] = useState([]);
  const [finalResult, setFinalResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textInput, setTextInput] = useState(''); // Nouvel état pour le texte

  useEffect(() => {
    const fetchScripts = async () => {
      try {
        const userScripts = await getAllFilesForUser(user.sub);
        const savedScripts = await getSavedScripts(user.sub);
        const combinedScripts = [...userScripts, ...savedScripts];

        const validScripts = combinedScripts.filter(script => script.fileContent && script.fileContent.trim() !== "" && script.tags && script.tags.trim() !== "" );
        
        setScripts(combinedScripts);
        setFilteredScripts(validScripts);
      } catch (error) {
        console.error('Erreur lors de la récupération des scripts', error);
      }
    };

    fetchScripts();
  }, [user]);

  useEffect(() => {
    let interval;
    if (jobId) {
      interval = setInterval(async () => {
        try {
          console.log("Demande de résultat...");
          const response = await getPipelineResult(jobId);
          console.log("Réponse du pipeline:", response);

          if (response.message === 'Job is still processing') {
            console.log('Job is still processing');
          } else if (response.error) {
            clearInterval(interval);
            setIsProcessing(false);
            console.error('Erreur lors de la récupération des résultats de pipeline:', response.error);
            // Afficher l'erreur en rouge
            alert(`Erreur : ${response.error}`);
          } else if (response.returnvalue) {
            clearInterval(interval); 
            setIsProcessing(false);
            const { resultat, idFichierIntermediaire } = response.returnvalue;
            console.log("ID des fichiers intermédiaires:", idFichierIntermediaire);
            
            // Set final result and script results
            setFinalResult(resultat);
            
            let scriptResults = await Promise.all(
              idFichierIntermediaire.map(id => getFileById(id))
            );
            scriptResults = scriptResults.flat();
            console.log("Résultats des scripts intermédiaires:", scriptResults);

            const decodedResults = scriptResults.map(result => ({
              ...result,
              decodedContent: result.fileContent ? decodeBase64(result.fileContent) : "Aucun contenu disponible",
            }));
            
            setResults(decodedResults);
          } else {
            console.error("La réponse du pipeline n'a pas le format attendu.");
          }
        } catch (error) {
          clearInterval(interval);
          console.error('Erreur lors de la récupération des résultats de pipeline:', error);
          setIsProcessing(false);
          // Afficher l'erreur en rouge
          alert(`Erreur : ${error.message}`);
        }
      }, 4000); 
    }
    return () => {
      if (interval) {
        clearInterval(interval); 
      }
    };
  }, [jobId]);

  const validationSchema = Yup.object({
    selectedScripts: Yup.array().of(
      Yup.object().shape({
        scriptId: Yup.number().required('Le script est requis'),
      })
    ).min(1, 'Au moins un script doit être sélectionné'),
  });

  const onSubmit = async (values) => {
    console.log('Form values:', values);
    try {
      const formData = new FormData();
      const scriptsId = values.selectedScripts.map(script => script.scriptId);

      formData.append('scriptsId', JSON.stringify(scriptsId));
      formData.append('id_user', user.nickname);

      if (textInput) {
        const blob = new Blob([textInput], { type: 'text/plain' });
        formData.append('file', blob, 'input.txt');
      } else if (values.inputFile) {
        formData.append('file', values.inputFile);
      }

      const response = await executePipeLine(formData);
      console.log('Réponse de l\'exécution du pipeline:', response);

      if (response && response.jobId) {
        setJobId(response.jobId);
        setIsProcessing(true);
        setResults([]);
        setFinalResult(null);
      } else {
        console.error('Erreur lors de l\'exécution du pipeline');
      }
    } catch (error) {
      console.error('Erreur lors de l\'exécution du pipeline', error);
    }
  };

  const onDrop = (acceptedFiles, setFieldValue) => {
    setFieldValue('inputFile', acceptedFiles[0]);
  };

  const decodeBase64 = (base64) => {
    try {
      if (typeof base64 === 'string') {
        const padding = base64.length % 4;
        if (padding > 0) {
          base64 += '='.repeat(4 - padding);
        }
        return atob(base64);
      } else {
        throw new Error('Le contenu n\'est pas une chaîne');
      }
    } catch (error) {
      console.error('Erreur lors du décodage base64:', error);
      return "Erreur lors du décodage";
    }
  };

  // Filtrer les résultats intermédiaires en excluant le dernier
  const intermediateResults = results.slice(0, -1);
  const finalResultContent = results.length > 0 ? results[results.length - 1].decodedContent : null;

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
                                {filteredScripts.map(script => (
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
              <Row>
                <Col md={6}>
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
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="textInput">Ou entrez du texte</Label>
                    <Input
                      type="textarea"
                      name="textInput"
                      id="textInput"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Saisissez votre texte ici..."
                    />
                  </FormGroup>
                </Col>
              </Row>
            </FormGroup>

            <FormGroup row>
              <Col sm={{ size: 10, offset: 2 }}>
                <Button type="submit" color="primary" disabled={isProcessing}>Exécuter le pipeline</Button>
              </Col>
            </FormGroup>
          </Form>
        )}
      </Formik>

      {isProcessing && (
        <div style={{ marginTop: '20px' }}>
          <Spinner color="primary" />
          <CardTitle tag="h5">Pipeline en cours d'exécution...</CardTitle>
        </div>
      )}

      {intermediateResults.length > 0 && intermediateResults.map((result, index) => (
        <ScriptResult key={index}>
          <CardBody>
            <CardTitle tag="h5">Résultat du script {index + 1} :</CardTitle>
            <CardText>
              <pre>{result.decodedContent}</pre>
            </CardText>
          </CardBody>
        </ScriptResult>
      ))}

      {finalResultContent && (
        <ScriptResult>
          <CardBody>
            <CardTitle tag="h5">Résultat final :</CardTitle>
            <CardText>
              <pre>{finalResultContent}</pre>
            </CardText>
          </CardBody>
        </ScriptResult>
      )}
    </FormContainer>
  );
};

export default PipelineForm;
