import { useState } from 'react';
import './LoginForm.css';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');

  function onChange(e) {
    setUsername(e.target.value);
  }

  function onSubmit(e) {
    e.preventDefault();
    onLogin(username);
  }

  return (
    <div className="login">
      <p>Please enter your username or 'Admin'</p>
      <form className="login__form" action="#/login" onSubmit={onSubmit}>
        <label>
          <span>Username:</span>
          <input className="login__username" value={username} onChange={onChange} />
        </label>
        <button className="login__button" type="submit">Login</button>
      </form>
    </div>
  );

}

export default LoginForm;
