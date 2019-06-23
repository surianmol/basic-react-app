import React, { Component } from "react";
import FormInput from "../forms/form-input";
import FormCard from "../forms/form-card";
import { Link, Redirect } from "react-router-dom";
import AppService, { API_URLS } from "../../services/app-service";

/**
 * Component renders login form, perform login validation and upon success
 * response redirects to user route.
 * It has link to reset password and signup routes as well.
 *
 * input props:
 * user: User detail object.
 * onUserDetailsChange: (userObject, save) => {}
 *
 * Routes:
 * /resetpassword
 * /user
 * /signup
 */
class Login extends Component {
  state = {
    password: "",
    isValidEmail: false,
    isValidPassword: false,
    errorMessage: "",
    loading: false
  };

  componentDidMount() {
    // As showing disabled user name field in case it is already available
    // setting the email validation to true.
    if (this.props.user.userName) {
      this.setState({ isValidEmail: true });
    }

    // Each time when user comes to login page reset authToken.
    this.props.onUserDetailsChange({ ...this.props.user, authToken: "" }, true);
  }

  handleInputValueChange = event => {
    if (event.target.name === "password") {
      this.setState({ password: event.target.value });
    }

    if (event.target.name === "email") {
      this.props.onUserDetailsChange({ userEmail: event.target.value });
    }
  };

  handleInputValidityChange = (event, isValid) => {
    if (event.target.name === "password") {
      this.setState({ isValidPassword: isValid });
    }

    if (event.target.name === "email") {
      this.setState({ isValidEmail: isValid });
    }
  };

  resetUserLinkClick = () => {
    // reset all user details.
    this.props.onUserDetailsChange(
      {
        userName: "",
        userEmail: "",
        userDetails: "",
        authToken: "",
        loggedIn: false
      },
      true
    );
  };

  handleLoginClick = event => {
    if (!this.state.isValidEmail || !this.state.isValidPassword) {
      return;
    }

    this.setState({ loading: true });

    // Send the request to authenticate.
    AppService.postRequest(API_URLS.LOGIN, {
      email: this.props.user.userEmail,
      password: this.state.password
    })
      .then(_data => {
        // Set error if it fails to authenticate.
        if (_data.error_code) {
          this.setState({ errorMessage: _data.message, loading: false });
          return;
        }

        // Set user object to the App component
        this.props.onUserDetailsChange(
          {
            loggedIn: true,
            userDetails: _data,
            authToken: _data.authentication_token,
            userName: _data.person.display_name,
            userEmail: this.props.user.userEmail
          },
          true
        );

        this.setState({ loading: false });
      })
      .catch(_error => {
        this.setState({
          loading: false,
          errorMessage: _error.message
            ? _error.message
            : "Unable to reach server!"
        });
      });
  };

  render() {
    const { errorMessage, loading } = this.state;
    const { loggedIn, userName, userEmail } = this.props.user;

    return (
      <React.Fragment>
        {loggedIn ? (
          <Redirect to="/user" />
        ) : (
          <FormCard
            title={`Welcome${
              userName ? " " + userName : ""
            }, Login to continue`}
            l
            loadingText={loading ? "Loading, Please wait..." : ""}
          >
            <div
              className="error-message"
              style={{ display: errorMessage ? "" : "none" }}
            >
              {errorMessage}
            </div>
            {userName ? (
              <FormInput
                label="User"
                type="text"
                value={userName}
                disabled
                required
                iconClass="tick"
              />
            ) : (
              <FormInput
                label="Email Id"
                type="email"
                name="email"
                placeHolder="E.g. test@example.com"
                onChange={this.handleInputValueChange}
                onValidityChange={this.handleInputValidityChange}
                value={userEmail}
                required
                focus={!userName}
              />
            )}
            <FormInput
              label="Password"
              type="password"
              name="password"
              placeHolder="Enter Password"
              required
              onChange={this.handleInputValueChange}
              onValidityChange={this.handleInputValidityChange}
              focus={!!userName}
            />
            <button className="form-button" onClick={this.handleLoginClick}>
              Login
            </button>
            <div className="link-container">
              <div>
                <Link to="/resetpassword">Forgot Password?</Link>
                {userName ? (
                  //eslint-disable-next-line
                  <a
                    //eslint-disable-next-line
                    href="javascript:void(0)"
                    onClick={this.resetUserLinkClick}
                  >
                    Not {userName}?
                  </a>
                ) : (
                  <Link to="/signup">Don't have an account? Get Started</Link>
                )}
              </div>
            </div>
          </FormCard>
        )}
      </React.Fragment>
    );
  }
}

export default Login;
