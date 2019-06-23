import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AppService, { API_URLS } from "../../services/app-service";

/**
 * Component to check if user is already logged and redirects to specific route.
 * input props:
 * user: User detail object.
 * onUserDetailsChange: (userObject, save) => {}
 *
 * Redirects to:
 * /login
 * /user
 */
class Home extends Component {
  state = {
    url: ""
  };

  componentDidMount() {
    // If auth token is not set redirect to login page
    if (!this.props.user.authToken) {
      this.setState({ url: "/login" });
      return;
    }

    // Check if auth token is still valid and redirect accordingly.
    AppService.getRequest(API_URLS.USER_DETAILS)
      .then(_data => {
        if (_data.error_code) {
          this.setState({ url: "/login" });
          return;
        }

        // Setting User details in case of success response.
        this.props.onUserDetailsChange(
          { loggedIn: true, userDetails: _data },
          false
        );
        this.setState({ url: "/user" });
      })
      .catch(_error => {
        this.setState({ url: "/login" });
      });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.url ? <Redirect to={this.state.url} /> : null}
      </React.Fragment>
    );
  }
}

export default Home;
