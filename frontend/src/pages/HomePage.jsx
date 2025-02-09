import { useNavigate } from 'react-router-dom';


function HomePage() {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    if (role === 'admin') {
      navigate('/adminlogin');
    } else if (role === 'parent' || role === 'mentor') {
      navigate(`/${role}`);
    }
  };

  return (
    <div>
      <h1>Welcome to connectEd</h1>
      <h2>Select your role</h2>
      <button onClick={() => handleRoleSelection('admin')}>Admin</button>
      <button onClick={() => handleRoleSelection('parent')}>Parent</button>
      <button onClick={() => handleRoleSelection('mentor')}>Mentor</button>
    </div>
  );
}

export default HomePage;
