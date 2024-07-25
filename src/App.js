import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./views/Home";
import { useAuth0 } from "@auth0/auth0-react";
import CommunitiesPage from "./views/CommunitiesPage";
import CommunityDetails from './views/CommunityDetailsPage';

// styles
import "./App.css";

// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
import UserProfilePage from "./views/UserProfilePage";
import CreateScriptPage from "./views/CreateScriptPage";
import PipelineExecution from "./views/PipelineExecution";
import FavoritesPage from "./views/FavoritePage";
import OtherUserProfilePage from'./views/OtherUserProfilePage'
initFontAwesome();

const App = () => {
  const { user, isLoading, error } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router>
      <div id="app" className="d-flex flex-column h-100">
        <NavBar />
        <Container className="flex-grow-1 mt-5">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/profile" component={UserProfilePage} />
            <Route path="/newScript" component={CreateScriptPage} />
            <Route path="/newPipeline" component={PipelineExecution} />
            <Route path="/favorites" component={FavoritesPage} />
            <Route path="/communities" component={CommunitiesPage} />
            <Route path="/community/:id" component={CommunityDetails} />
            <Route path="/profileOf/:userId" component={OtherUserProfilePage} /> {}
                      </Switch>
        </Container>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
