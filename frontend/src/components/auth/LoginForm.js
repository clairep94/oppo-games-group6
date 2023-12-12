import React, { useState } from 'react';

const LogInForm = ({ navigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    let response = await fetch( '/tokens', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, password: password })
    })

    if(response.status !== 201) {
      console.log("yay")
      navigate('/login')
    } else {
      console.log("oop")
      let data = await response.json()
      window.localStorage.setItem("token", data.token)
      navigate('/lobby');
    }
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }


    return (
      <form onSubmit={handleSubmit}>
        <label for="Email" class="accessible_visuallyhidden">Email: </label>
        <input placeholder='Email' id="email" type='text' value={ email } onChange={handleEmailChange} />

        <label for="Password" class="accessible_visuallyhidden">Password: </label>
        <input placeholder='Password' id="password" type='password' value={ password } onChange={handlePasswordChange} />

        <label for="login-button" class="accessible_visuallyhidden">Login Button: </label>
        <input role='login-button' id='login-button' type="submit" value="Login" />


      </form>
    );
}

export default LogInForm;
