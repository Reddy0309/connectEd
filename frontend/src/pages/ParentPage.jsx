import { Link, useNavigate } from 'react-router-dom';

function ParentPage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Parent Page</h1>
      <Link to="/login">
        <button>Parent Login</button>
      </Link>
      <button onClick={() => navigate('/')}>Go Back</button>
    </div>
  );
}

export default ParentPage;
