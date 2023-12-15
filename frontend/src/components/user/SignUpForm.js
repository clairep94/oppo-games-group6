import React, { useState } from 'react';
import styles from './SignUpForm.module.css';
const SignUpForm = ({ navigate }) => {

    // =========== STATE VARIABLES ==========================
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [retypePassword, setRetypePassword] = useState("");
  const [error, setError] = useState(null);

  // ============ FORM SUBMISSION FOR SIGNUP ====================
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !email || !password || !retypePassword) {
      setError("All fields must be filled"); 
      return;
    } else {
      setError("")
    }

    if (!isValidUsername(username)) {
      setError("Username must have at least 6 characters and must not include any spaces or special characters");
      return;
    } else {
      setError("");
    }

    if (!isValidPassword(password)) {
      setError("Password must have at least 8 characters with no spaces and must include at least 1 special character and 1 number");
      return;
    } else {
      setError("");
    }

    if (password !== retypePassword) {
      setError("Passwords do not match")
      return;
    } else {
      setError("")
    }
    

    fetch( '/users', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username, email: email, password: password })
    })
      .then(response => {
        if(response.status === 201) {
          navigate('/lobby')
        } else {
          navigate('/signup')
        }
      })
  }

  // ------------ SUPPORTIVE FUNCTIONS: ----------------
  // FUNCTIONS FOR CHANGING STATE VARIABLES 
  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }
  
  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleSetPasswordHidden = (event) => {
    setPasswordHidden(!passwordHidden)
  }

  const handleRetypePasswordChange = (event) => {
    setRetypePassword(event.target.value)
  }

    return (
      <>
      <h2>Sign Up</h2>

      <form onSubmit={handleSubmit}>

          <input aria-label="Username input field" placeholder="Username" id="username" type='text' value={ username } onChange={handleUsernameChange} />
          <input aria-label="Email address input field" placeholder="Email" id="email" type='text' value={ email } onChange={handleEmailChange} />
          <input aria-label="Password input field" placeholder="Password" id="password" type={passwordHidden ? 'password': 'text'} value={ password } onChange={handlePasswordChange} />
          <input aria-label="Retype password input field" placeholder="Retype Password" id="retype-password" type={passwordHidden ? 'password': 'text'} value={retypePassword} onChange={handleRetypePasswordChange}/>
          {/* BUTTON TO TOGGLE PW VISIBILITY */}
          <button
            onClick={handleSetPasswordHidden} id="toggle-pw-visibility-button" button type="button" aria-label="Toggle Password Visibility Button"> {passwordHidden ? 'Show Password' : 'Hide Password'}
          </button>
          <input aria-label="Submit button" id='submit' type="submit" value="Submit"/>
      </form>

        
      
      {/* ERROR MESSAGES */}
      {error && <p aria-label="Error Message" className={styles.errorMessage}>{error}</p>}
      
      <br/>
      <p aria-label="Aready have an account? Log in">
      <font color="#505050 ">Already have an account? </font>
      <a aria-label="Link to Log in" href="/login" font color="#003163" className={styles.link}>Log in</a>
      </p>
      </>
    
    );
}

function isValidPassword(password) {
  // Password must have at least 8 characters with no spaces and must include at least 1 special character and 1 number
  const passwordRegex = /^(?!.*\s)(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})(?=.*[a-z])(?=.*[A-Z])/;
  return passwordRegex.test(password);
}

function isValidUsername(username) {
  //Username must have at least 6 characters and must not include any spaces or special characters
  const usernameRegex = /^[a-zA-Z0-9]{6,}$/;
  return usernameRegex.test(username);
}

export default SignUpForm;
