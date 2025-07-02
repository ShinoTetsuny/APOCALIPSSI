import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthWrapper = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  const handleRegisterSuccess = () => {
    setIsLogin(true);
  };

  return (
    <>
      {isLogin ? (
        <Login onToggleMode={toggleMode} />
      ) : (
        <Register 
          onToggleMode={toggleMode} 
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}
    </>
  );
};

export default AuthWrapper; 