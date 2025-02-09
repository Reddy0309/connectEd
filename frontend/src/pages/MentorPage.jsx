import { Link, useNavigate } from 'react-router-dom';

function MentorPage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Mentor Page</h1>
      <Link to="/mentorLogin">
        <button>Mentor Login</button>
      </Link>
      <button onClick={() => navigate('/')}>Go Back</button>
    </div>
  );
}

export default MentorPage;
