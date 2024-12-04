import React, { useState } from 'react';
import './Login.css';

function Login() {
  const [role, setRole] = useState('user');

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Logged in as ${role}`);
  };

  return (
    <div className="login">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label>
          Role:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Banquet Admin</option>
          </select>
        </label>
        <label>
          Email:
          <input type="email" required />
        </label>
        <label>
          Password:
          <input type="password" required />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
