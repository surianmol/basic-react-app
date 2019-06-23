import React, { Component } from "react";

import "./App.css";

import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./components/pages/login";
import RegisterUser from "./components/pages/register-user";
import ForgotPassword from "./components/pages/forgot-password";
import Home from "./components/pages/home";
import UserDetails from "./components/pages/user-details";
import AppService from "./services/app-service";

/**
 * Root component, it has all the route and state.
 */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = AppService.loadState();
  }

  setUser = (user, saveChanges) => {
    if (saveChanges) {
      AppService.saveState(user);
    }

    this.setState(user);
  };

  render() {
    return (
      <Router>
        <Route
          path="/"
          exact
          render={() => (
            <Home user={this.state} onUserDetailsChange={this.setUser} />
          )}
        />
        <Route
          exact
          path="/login"
          render={() => (
            <Login user={this.state} onUserDetailsChange={this.setUser} />
          )}
        />
        <Route
          exact
          path="/signup"
          render={() => (
            <RegisterUser
              user={this.state}
              onUserDetailsChange={this.setUser}
            />
          )}
        />
        <Route
          exact
          path="/resetpassword"
          render={() => (
            <ForgotPassword
              user={this.state}
              onUserDetailsChange={this.setUser}
            />
          )}
        />
        <Route
          exact
          path="/user"
          render={() => (
            <UserDetails user={this.state} onUserDetailsChange={this.setUser} />
          )}
        />
      </Router>
    );
  }
}

export default App;
