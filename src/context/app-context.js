import React from "react";

/**
 * Default app context for user state.
 */
const AppContext = React.createContext({
  userName: localStorage.getItem("userName"),
  userEmail: localStorage.getItem("userEmail"),
  authToken: localStorage.getItem("authToken"),
  userDetails: {},
  loggedIn: false
});

export default AppContext;
