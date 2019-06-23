import React, { Component } from "react";
import FormCard from "../forms/form-card";
import FormInput from "../forms/form-input";
import { Link, Redirect } from "react-router-dom";
import AppService, { API_URLS } from "../../services/app-service";

/**
 * Component renders user registration form, perform login validation and upon
 * success response redirects to user route.
 * It resets the user object on initialization, and set the user once response
 * is validated.
 *
 * It has link to login routes as well.
 *
 * input props:
 * user: User detail object.
 * onUserDetailsChange: (userObject, save) => {}
 *
 * Routes:
 * /user
 * /login
 */
class RegisterUser extends Component {
  state = {
    userName: "",
    userEmail: "",
    password: "",
    cPassword: "",
    passwordValidations: null,
    loadingText: "Loading...",
    errorMessage: "",
    validity: {
      userName: false,
      userEmail: false,
      password: false,
      cPassword: false
    }
  };

  componentDidMount() {
    // This will reset the previous user details if any.
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

    // Send request to get password validation data.
    AppService.getRequest(API_URLS.PASSWORD_REQUIREMENTS)
      .then(this.setPassword)
      .catch(() => {
        // This should not occur
        this.setPassword({
          require_lowercase: true,
          require_number: true,
          require_special: true,
          require_uppercase: true,
          min_chars: 8
        });
      });
  }

  handleSignUpClick = () => {
    // Return if form is not valid.
    if (
      !this.state.validity.userName ||
      !this.state.validity.userEmail ||
      !this.state.validity.password ||
      !this.state.validity.cPassword
    ) {
      return;
    }

    // Setting message to show mask.
    this.setState({ loadingText: "Registering..." });

    // Send request to register user.
    AppService.postRequest(API_URLS.CREATE_USER, {
      display_name: this.state.userName,
      email: this.state.userEmail,
      password: this.state.password
    })
      .then(_data => {
        this.setState({ loadingText: "" });
        if (_data.error_code) {
          this.setState({ errorMessage: _data.message });
          return;
        }

        // Set the user details on success.
        this.props.onUserDetailsChange(
          {
            loggedIn: true,
            userDetails: _data,
            authToken: _data.authentication_token,
            userName: _data.person.display_name,
            userEmail: this.state.userEmail
          },
          true
        );
      })
      .catch(_error => {
        this.setState({ loadingText: "" });
        this.setState({
          errorMessage: _error.message
            ? _error.message
            : "Unable to reach server!"
        });
      });
  };

  // Method creates and sets the password validation regex.
  setPassword = _data => {
    let regex = "^";
    if (_data.require_lowercase) {
      regex += "(?=.*[a-z])";
    }

    if (_data.require_uppercase) {
      regex += "(?=.*[A-Z])";
    }

    if (_data.require_number) {
      regex += "(?=.*[0-9])";
    }

    if (_data.require_special) {
      regex += "(?=.*[!@#%&+=-_])";
    }

    if (_data.min_chars || _data.max_chars) {
      regex += "(?=.{" + _data.min_chars + "," + _data.max_chars + "})";
    }

    this.setState({
      passwordValidations: new RegExp(regex),
      loadingText: null
    });
  };

  handleInputChange = event => {
    let localState = {};
    localState[event.target.name] = event.target.value;

    this.setState(localState);
  };

  handleInputValidityChange = (event, valid) => {
    let localState = {};
    localState[event.target.name] = valid;

    this.setState(state => ({
      validity: { ...state.validity, ...localState }
    }));
  };

  // Custom validation for password and confirm password field.
  validatePassword = value => {
    if (!this.state.passwordValidations.test(value)) {
      return "Password should match the criteria";
    }
  };

  validateCPassword = value => {
    if (value !== this.state.password) {
      return "Confirm Password field should match Password field";
    }
  };

  render() {
    const { errorMessage } = this.state;

    return (
      <React.Fragment>
        {this.props.user.loggedIn ? (
          <Redirect to="/user" />
        ) : (
          <FormCard
            loadingText={this.state.loadingText}
            title="Create new account"
          >
            <div
              className="error-message"
              style={{ display: errorMessage ? "" : "none" }}
            >
              {errorMessage}
            </div>
            <FormInput
              label="Name"
              type="text"
              name="userName"
              placeHolder="Display Name"
              required
              onChange={this.handleInputChange}
              onValidityChange={this.handleInputValidityChange}
              focus
            />
            <FormInput
              label="Email Id"
              type="email"
              name="userEmail"
              placeHolder="E.g. test@example.com"
              required
              onChange={this.handleInputChange}
              onValidityChange={this.handleInputValidityChange}
            />
            <FormInput
              label="Password"
              type="password"
              name="password"
              placeHolder="Enter Password"
              labelInfo={
                "Password should be at least 6 characters with a mix of upper and " +
                "lower case letters, numbers and special characters !@#%&+=-_"
              }
              required
              isValid={this.validatePassword}
              onChange={this.handleInputChange}
              onValidityChange={this.handleInputValidityChange}
            />
            <FormInput
              label="Confirm Password"
              type="password"
              name="cPassword"
              placeHolder="Re-enter Password"
              required
              isValid={this.validateCPassword}
              onChange={this.handleInputChange}
              onValidityChange={this.handleInputValidityChange}
            />
            <button className="form-button" onClick={this.handleSignUpClick}>
              Sign Up
            </button>
            <div className="link-container">
              <div>
                <Link to="/login">Existing User? Click here to Login</Link>
              </div>
            </div>
          </FormCard>
        )}
      </React.Fragment>
    );
  }
}

export default RegisterUser;
