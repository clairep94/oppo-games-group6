import React, { useState } from 'react';
// import { useLocation } from 'react-router-dom'; // use this for login-popup when timed-out
import styles from './LoginForm.module.css'

const LogInForm = ({ navigate }) => {

  // =========== STATE VARIABLES ==========================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  // const location = useLocation(); // use this for login-popup when timed-out



  // ============ FORM SUBMISSION FOR LOGIN ====================
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Send POST request to '/tokens' endpoint
    let response = await fetch( '/tokens', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, password: password })
    })

    // Checking the response status
    if(response.status === 401){ // wrong password
      setError("Enter a valid email or password")
    } else if (response.status !== 201) { // if error code is not 401 or 201, show server error
      setError("Server error, please try again later")
    } else { // login successful
      let data = await response.json()
      window.localStorage.setItem("token", data.token)
      

      // TEMP: No timeout login popup:
      navigate('/lobby')

      // FOR FUTURE USE IF HAVING TIMEOUT LOGIN POPUP:
      // // Check the current location and navigate accordingly
      // if (location.pathname === '/') {
      //   navigate('/timeline');
      // } else {
      //   // 
      // }
      // window.location.reload(); // Necessary addition so that page after successful login if logging in after timed out
    }
  }



  // ------------ SUPPORTIVE FUNCTIONS: ----------------
  // FUNCTIONS FOR CHANGING STATE VARIABLES 
  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  // Enter a valid email or password


  // ========= JSX FOR THE UI OF THE COMPONENT =====================
  // for all styling: use className={styles.Button}
    return (
      <>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label for="Email" class="accessible_visuallyhidden">Email: </label>
        <input placeholder='Email' id="email" type='text' value={ email } onChange={handleEmailChange} />

        <label for="Password" class="accessible_visuallyhidden">Password: </label>
        <input placeholder='Password' id="password" type='password' value={ password } onChange={handlePasswordChange} />

        <label for="login-button" class="accessible_visuallyhidden">Login Button: </label>
        <input role='login-button' id='login-button' type="submit" value="Login" />

      </form>

      {error && <p className={styles.errorMessage}>{error}</p>}
      </>
    );
}

export default LogInForm;
