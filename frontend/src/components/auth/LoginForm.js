import React, { useState } from 'react';
import loginImg from "../../assets/gaming-comuter-headphones-set.png"
// import { useLocation } from 'react-router-dom'; // use this for login-popup when timed-out
// import styles from './LoginForm.module.css'

const LogInForm = ({ navigate }) => {

  // =========== STATE VARIABLES ==========================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [passwordHidden, setPasswordHidden] = useState(true);

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

  const handleSetPasswordHidden = (event) => {
    setPasswordHidden(!passwordHidden)
  }

  const solidborder = "border-solid border-2 border-indigo-400"
  // Enter a valid email or password


  // ========= JSX FOR THE UI OF THE COMPONENT =====================
  // for all styling: use className={styles.Button}


  const basicFont = "pt-3 text-white text-lg font-extralight tracking-widest text-wrap"
  const bgGradient = "bg-gradient-to-br from-gray-900 via-customPurple to-customIndigo "
  const h2Style = "pt-3 pb-3 text-7xl text-white font-extrabold"
  const buttonStyle = "w-2/5 bg-customPink text-xl text-white font-semibold rounded-lg py-2 px-4 hover:bg-pink-600 focus:outline-none focus:shadow-outline-pink active:bg-pink-700"

    return (
      <>
      <div className={`flex h-screen ${bgGradient}`}>

      {/* LEFT side with image */}
      <div className="flex-1 hidden lg:flex items-center justify-center w-1/2">
        <img src={loginImg} alt="Login Image" className="pl-20 flex-col justify-center"></img>
      </div>

      {/* RIGHT side with login form */}
      <div className="flex-1 pl-40 pr-40 pt-80 pb-80">
      <h2 className={h2Style}>Login</h2>
      
      {/* LOGIN FORM */}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          aria-label="Email Field" 
          placeholder='Email' 
          id="email" 
          type='text' 
          value={email} 
          onChange={handleEmailChange} 
          className="p-2 rounded-lg border-2 border-gray-300"
        />
        
        <input 
          aria-label="Password Field" 
          placeholder='Password' 
          id="password" 
          type={passwordHidden ? 'password': 'text'} 
          value={password} 
          onChange={handlePasswordChange} 
          className="p-2 rounded-lg border-2 border-gray-300"
        />

        <input 
          aria-label="Login Button" 
          role='login-button' 
          id='login-button' 
          type="submit" 
          value="Login" 
          className={buttonStyle}
        />
      </form>

      {/* BUTTON TO TOGGLE PW VISIBILITY */}
      <button 
        aria-label="Toggle Password Visibility Button"
        onClick={handleSetPasswordHidden}
        id="toggle-pw-visibility-button"
        type="button"
        className="text-sm text-white underline mt-2"
      >
        {passwordHidden ? 'Show Password' : 'Hide Password'}
      </button>

      {/* ERROR MESSAGES */}
      {error && <p aria-label="Login Error Message" className="text-red-500 mt-4">{error}</p>}

      {/* Register Link */}
      <p aria-label="Don't have an account? Register" className="mt-4 text-gray-500">
        Don't have an account?{' '}
        <a aria-label="Link to Register" href="/signup" className="text-blue-600">Register</a>
      </p>
    </div>

  </div>
  </>
    );
}

export default LogInForm;











// LOGIN FORM WITHOUT TAILWIND CSSS //


// <>

// <h2>Login</h2>

// {/* LOGIN FORM */}
// <form onSubmit={handleSubmit} >
//   {/* <label for="Email" class="accessible_visuallyhidden">Email: </label> */}
//   {/* EMAIL FIELD */}
//   <input
//   aria-label="Email Field" 
//   placeholder='Email' 
//   id="email" 
//   type='text' 
//   value={ email } 
//   onChange={handleEmailChange} 
//   />
//   {/* PASSWORD FIELD */}
//   <input 
//   aria-label="Password Field" 
//   placeholder='Password' 
//   id="password" 
//   type={passwordHidden ? 'password': 'text'} 
//   value={ password } 
//   onChange={handlePasswordChange} 
//   />

//   <input aria-label="Login Button" role='login-button' id='login-button' type="submit" value="Login" />
// </form>

// {/* BUTTON TO TOGGLE PW VISIBILITY */}
// <button 
//   aria-label="Toggle Password Visibility Button"
//   onClick={handleSetPasswordHidden}
//   id="toggle-pw-visibility-button"
//   button type="button"
//   >
//     {passwordHidden ? 'Show Password' : 'Hide Password'}
// </button>

// {/* ERROR MESSAGES */}
// {error && <p aria-label="Login Error Message"  >{error}</p>}

// <br/>
// <p aria-label="Don't have an account? Register">
//   <font color="#505050 ">Don't have an account? </font>
//   <a aria-label="Link to Register" href="/signup" font color="#003163">Register</a>
// </p>
// </>





