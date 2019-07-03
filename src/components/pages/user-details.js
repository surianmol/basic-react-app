import React, { Component } from "react";
import AppService, { API_URLS } from "../../services/app-service";
import { Redirect, Link } from "react-router-dom";
import Map from "../containers/map";

/**
 * Component renders user registration form, perform login validation and upon
 * success response redirects to user route.
 * It sets the userDetails value of props on initialization.
 *
 * Upon clicking on logout, user is redirecting login route.
 *
 * input props:
 * user: User detail object.
 * onUserDetailsChange: (userObject, save) => {}
 *
 * Routes:
 * /login
 */
class UserDetails extends Component {
  state = {
    loading: true
  };

  componentDidMount() {
    const { authToken } = this.props.user;

    // If authToken is not set, redirect to login page.
    if (!authToken) {
      this.props.onUserDetailsChange({ loggedIn: false });
      this.setState({ loading: false });
      return;
    }

    this.setState({ loading: true });

    // Send request to validate and get user details.
    AppService.getRequest(API_URLS.USER_DETAILS)
      .then(_data => {
        // If auth token is expired or not valid
        // Set loggedIn flag and redirect to login.
        if (_data.error_code) {
          this.props.onUserDetailsChange({ loggedIn: false });
          this.setState({ loading: false });
          return;
        }

        // Set userDetails and loggedIn flag.
        this.props.onUserDetailsChange({ loggedIn: true, userDetails: _data });
        this.setState({ loading: false });
      })
      .catch(_error => {
        this.setState({ loading: false });
        this.props.onUserDetailsChange({ loggedIn: false });
      });
  }

  toggleSideBar = () => {
    this.setState(state => ({
      sideBarVisible: !state.sideBarVisible
    }));
  };

  handleResetPasswordClick = () => {
    // Send reset password request to server and show error
    // or success message on response accodingly.
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

  handleOkButtonClick = () => {
    this.setState({ errorMessage: null, successMessage: null });
  };

  /**
   * Get side bar annimation style upon side nav toggle.
   * i.e. slidein or slideout
   */
  getSideBarStyle = () => {
    let sideBarStyle;

    if (this.state.sideBarVisible === undefined) {
      sideBarStyle = {};
    } else if (this.state.sideBarVisible) {
      sideBarStyle = {
        animation: "slidein .5s ease-in-out",
        right: 0
      };
    } else {
      sideBarStyle = {
        animation: "slideout .5s ease-in-out"
      };
    }

    return sideBarStyle;
  };

  /**
   * Return account updated message in readable format.
   */
  getLastUpdated = ({ updated_at }) => {
    let diff = (new Date() - new Date(updated_at)) / 1000;
    let hours = diff / (60 * 60);

    if (hours < 1) {
      return "Less than an hour ago!";
    }

    if (hours < 2) {
      return "1 hour ago!";
    }

    if (hours < 24) {
      return `${Math.round(hours)} hours ago!`;
    }

    let days = hours / 24;

    if (days < 30) {
      return `${Math.round(days)} days ago!`;
    }

    return "More than 30 days ago!";
  };

  /**
   * Method returns the account age, formatted to user readable date.
   * cases:
   * returns label Created On with day or date.
   * returns label Account age with number of hours or days.
   */
  getAccountAge = ({ created_at }) => {
    let date = new Date(created_at);
    let diff = (new Date() - date) / 1000;
    let hours = diff / (60 * 60);

    if (hours <= new Date().getHours()) {
      return { label: "Created On", value: "Today" };
    }

    if (hours <= 24) {
      return { label: "Account age", value: `${Math.round(hours)} hours` };
    }

    let days = hours / 24;

    if (days < 30) {
      return { label: "Account age", value: `${Math.round(days)} days` };
    }

    return {
      label: "Created On",
      value: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    };
  };

  render() {
    const { userName, loggedIn, userEmail, userDetails } = this.props.user;
    const { errorMessage, successMessage } = this.state;
    const accountAgeInfo = this.getAccountAge(userDetails);

    return (
      <React.Fragment>
        {this.state.loading ? (
          <div className="form-card">Loading...</div>
        ) : !loggedIn ? (
          <Redirect to="/login" />
        ) : (
          <div
            className="user-card"
            onClick={() => {
              if (this.state.sideBarVisible) {
                this.toggleSideBar();
              }
            }}
          >
            <div className="title-bar">
              <div>Home Page Title</div>
              <div className="avatar" onClick={this.toggleSideBar} />
            </div>
            <Map />
            <div
              className="side-bar"
              style={this.getSideBarStyle()}
              onClick={event => {
                event.stopPropagation();
              }}
            >
              <div>
                <div className="name">{userName}</div>
                <div className="info">{userEmail}</div>
                <div className="details">
                  <span>{accountAgeInfo.label}: </span>
                  {accountAgeInfo.value}
                </div>
              </div>
              <div>
                <div className="details">
                  <span>Last updated: </span>
                  {this.getLastUpdated(userDetails)}
                </div>
                <div className="link">
                  {
                    //eslint-disable-next-line
                    <a
                      //eslint-disable-next-line
                      href="javascript:void(0)"
                      onClick={this.handleResetPasswordClick}
                    >
                      Reset Password
                    </a>
                  }
                  <Link to="/login">Logout</Link>
                </div>
              </div>
            </div>
            <div
              className="message-wrapper"
              style={{ display: errorMessage || successMessage ? "" : "none" }}
              onClick={event => {
                event.stopPropagation();
              }}
            />
            <div
              className="message"
              style={{ display: errorMessage || successMessage ? "" : "none" }}
              onClick={event => {
                event.stopPropagation();
              }}
            >
              <div className="title">Reset Password</div>
              {errorMessage ? (
                <div className="error-message">{errorMessage}</div>
              ) : successMessage ? (
                <div className="success-message">{successMessage}</div>
              ) : null}
              <button
                className="form-button"
                style={{ float: "right", margin: "12px 0" }}
                onClick={this.handleOkButtonClick}
              >
                Ok
              </button>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default UserDetails;
