import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token
    navigate('/login'); // Redirect to login page
  };

  return (
    <nav>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default Navbar;
