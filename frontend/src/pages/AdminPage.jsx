import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
 
function AdminPage() {

  const navigate = useNavigate();

   useEffect(() => {
    const isAdminAuthenticated = localStorage.getItem('adminAuth'); 
    if (!isAdminAuthenticated) {
      alert("Admin should login first!");
      navigate('/adminlogin'); // Redirect to admin login page
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear any authentication-related data (if using localStorage or context)
    localStorage.removeItem('adminAuth'); // Example, if storing auth status
    // Redirect to HomePage
    navigate('/');
  };

  return (
    <div>
      <h1>Admin Options</h1>

      {/* Login Button */}
      <Link to="/login">
        <button>Login To a Parent/Mentor Page</button>
      </Link>
      <br />

      {/* Register Button */}
      <Link to="/register">
        <button>Register a New Parent/Mentor</button>
      </Link>
      <br />

      {/* Add Attendance Button */}
      <Link to="/add-attendance">
        <button>Add Attendance Student Data</button>
      </Link>

      <button onClick={handleLogout}>Logout</button>

    </div>
  );
}

export default AdminPage;
