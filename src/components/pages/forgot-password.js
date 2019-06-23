import React, { Component } from "react";
import FormCard from "../forms/form-card";
import FormInput from "../forms/form-input";
import { Link } from "react-router-dom";
import AppService, { API_URLS } from "../../services/app-service";

/**
 * Component renders reset password form with email field, sends a
 * reset password request.
 * It has link to login routes as well.
 *
 * input props:
 * user: User detail object.
 * onUserDetailsChange: (userObject, save) => {}
 *
 * Routes:
 * /login
 */
class ForgotPassword extends Component {
  state = {
    errorMessage: "",
    successMessage: "",
    valid: false
  };

  handleResetPasswordClick = () => {
    // Clear the previous messages
    this.setState({ successMessage: "", errorMessage: "" });

    if (!this.state.valid) {
      return;
    }

    // Send the request to reset password to server.
    AppService.postRequest(API_URLS.RESET_PASSWORD, {
      email: this.props.user.userEmail
    })
      .then(_data => {
        if (_data.error_code) {
          this.setState({ errorMessage: _data.message });
          return;
        }

        this.setState({
          successMessage: _data.message
            ? _data.message
            : "An email with a link to reset your password has been sent to yourEmail ID"
        });
      })
      .catch(_error => {
        this.setState({
          errorMessage: _error.message
            ? _error.message
            : "Unable to reach server!"
        });
      });
  };

  handleInputValueChange = event => {
    // Set the email and user name so that it reflects on login page.
    this.props.onUserDetailsChange(
      { userEmail: event.target.value, userName: "" },
      false
    );

    this.setState({ successMessage: "", errorMessage: "" });
  };

  handleInputValidityChange = (event, isValid) => {
    this.setState({
      valid: isValid
    });
  };

  render() {
    const successMessageStyle = {
      display: this.state.successMessage ? "" : "none"
    };

    const errorMessageStyle = {
      display: this.state.errorMessage ? "" : "none"
    };

    return (
      <FormCard height="220" title="Reset Password using Email Id">
        <FormInput
          label="Email Id"
          type="email"
          placeHolder="Enter email id"
          onChange={this.handleInputValueChange}
          onValidityChange={this.handleInputValidityChange}
          value={this.props.user.userEmail}
          focus
          required
        />
        <button className="form-button" onClick={this.handleResetPasswordClick}>
          Reset Password
        </button>
        <div className="success-message" style={successMessageStyle}>
          {this.state.successMessage}
        </div>
        <div className="error-message" style={errorMessageStyle}>
          {this.state.errorMessage}
        </div>
        <div className="link-container">
          <div>
            <Link to="/login">Back</Link>
          </div>
        </div>
      </FormCard>
    );
  }
}

export default ForgotPassword;
