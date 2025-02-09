import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === 'admin1' && password === 'ksit2025') {
      localStorage.setItem('adminAuth', 'true'); // Store the token in localStorage
      alert('Login successful');
      navigate('/admin'); // Navigate to admin dashboard if credentials match
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <br />
      <button onClick={() => navigate('/')}>Go Back</button>
    </div>
  );
}

export default AdminLogin;
