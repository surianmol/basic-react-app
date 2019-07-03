# Basic React App

This project is bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Development

Here are the steps to run the project.

- Run `npm install` in project directory.
- Run `npm start` to run the developement server<br>
  Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
- Run `npm run build` to build the project in production mode.

### Dependencies

    react,
    react-dom,
    react-router-dom,
    react-scripts

## Pages

- Landing Page (`home.js`): Checks if a user is already logged in and redirects to a specific route.
- Login Page (`login.js`): Renders a login form and redirects the user to details page upon successful login.
- Forgot Password page (`forgot-password.js`): Renders reset password form with an email field, sends a reset password request on submit.
- Signup Page (`register-user.js`): Renders a user registration form redirects the user to details page upon successful user creation.
- User Details Page(`user-details.js`): Renders a user detail landing page with toggleable sidebar.

## Note

Set the google map api key to constant `GOOGLE_MAP_API_KEY` in `map.js`
