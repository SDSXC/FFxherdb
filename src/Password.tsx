import React, { useState } from 'react';
import './Password.css';

const Password = ({onDecrypt,isLoading}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!password.trim()) {
      setError('请输入密码');
      return;
    }
    
    try {
      await onDecrypt(password);
    } catch (err) {
      setError(err.message || '解密失败，请检查密码');
    }
  };

  return (
    <div className="password-container">
      <div className="password-card">
        <h2>请输入密码</h2>
        
        <form onSubmit={handleSubmit} className="password-form">
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入访问密码"
              className="password-input"
              disabled={isLoading}
              autoFocus
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? '解密中...' : '访问数据库'}
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default Password;