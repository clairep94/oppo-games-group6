import React, { useState, useEffect } from 'react';
import LogInForm from './LoginForm';

export default function LoginPopup({ navigate}) {

  const closeLoginPopup = () => {
    navigate('/login')
  }

  const goToRegister = () => {
    navigate('/signup')
  }

  const frostTexture = `
  backdrop-blur-md bg-purple-100/20 shadow-xl shadow-[#444a6b] border-[2.5px] border-white/10 place-self-center`


  return (
    <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center z-50'>
      {/* BACKGROUND */}
      <div aria-label="login popup background" className='fixed top-0 left-0 w-full h-full bg-slate-50 opacity-50'></div>

      {/* POPUP CONTAINER */}
      <div aria-label='login popup container'
        className={`flex flex-col
                    justify-center
                    h-[28rem] min-w-[28rem] 
                    rounded-lg p-5 py-10 items-center
                    relative` + frostTexture}>
        {/* X to exit */}
        <span className='text-[1.5rem] absolute top-6 right-8 cursor-pointer' onClick={closeLoginPopup}>
          &times;
        </span>
        {/* Login Form - this form takes you to the signup page if you click 'register' */}
        <LogInForm navigate={navigate} switchForms={goToRegister} />
      </div>
    </div>
  );
}
