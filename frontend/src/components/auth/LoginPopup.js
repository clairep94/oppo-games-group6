import React, { useState, useEffect } from 'react';
import LogInForm from './LoginForm';

export default function LoginPopup({ navigate}) {

  const closeLoginPopup = () => {
    navigate('/login')
  }

  const goToRegister = () => {
    navigate('/signup')
  }

  return (
    <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center z-50'>
      {/* BACKGROUND */}
      <div aria-label="login popup background" className='fixed top-0 left-0 w-full h-full bg-slate-50 opacity-50'></div>

      {/* POPUP CONTAINER */}
      <div aria-label='login popup container'
        className='bg-white flex flex-col
                    justify-center
                    h-[28rem] min-w-[28rem] 
                    rounded-lg p-5 py-10 items-center
                    dark:bg-gray-800 dark:border-gray-700 dark:border
                    shadow-[0px_0px_10px_0px_#d9deed] dark:shadow-lg
                    relative'>
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
