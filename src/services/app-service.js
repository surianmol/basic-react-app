const API_ENDPOINT = "http://blooming-stream-45371.herokuapp.com/";

/**
 * Static class provide utility methods
 */
class AppService {
  /**
   * Method sends a get request and returns a promise, it parses
   * to json and append available headers.
   * @param {string} url
   */
  static getRequest(url) {
    return fetch(API_ENDPOINT + url, {
      headers: {
        Authorization: localStorage.getItem("authToken")
      }
    }).then(response => {
      return response.json();
    });
  }

  /**
   * Method sends a post request with data as body and returns a
   * promise, it parses to json and append available headers.
   * @param {string} url
   * @param {any} data
   */
  static postRequest(url, data) {
    return fetch(API_ENDPOINT + url, {
      headers: {
        Authorization: localStorage.getItem("authToken"),
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(data)
    }).then(response => {
      return response.json();
    });
  }

  /**
   * Method saves the passed user state to localStorage.
   * @param {any} param
   */
  static saveState({ userName, userEmail, authToken }) {
    localStorage.setItem("userName", userName ? userName : "");
    localStorage.setItem("userEmail", userEmail ? userEmail : "");
    localStorage.setItem("authToken", authToken ? authToken : "");
  }

  /**
   * Method returns the default user state.
   */
  static loadState() {
    return {
      userName: localStorage.getItem("userName"),
      userEmail: localStorage.getItem("userEmail"),
      authToken: localStorage.getItem("authToken"),
      userDetails: {},
      loggedIn: false
    };
  }
}

export default AppService;

/**
 * Api url list.
 */
const API_URLS = {
  USER_DETAILS: "api/v2/people/me",
  RESET_PASSWORD: "api/v2/people/reset_password",
  LOGIN: "api/v2/people/authenticate",
  PASSWORD_REQUIREMENTS: "api/v2/people/password_requirements",
  CREATE_USER: "api/v2/people/create"
};

export { API_URLS };
