import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TrialPage = () => {
  const navigate = useNavigate();

  const openGoogleDocs = () => {
    window.open("https://accounts.google.com/AccountChooser?continue=https://drive.google.com", "_blank");
  };

  const goToAttendance = () => {
    navigate('/attendance'); // Redirect to Attendance Page
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token
    alert("Logged out successfully!");
    navigate('/'); // Redirect to login page
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login first!");
      navigate('/');  // Redirect to login page if not authenticated
    }
  }, [navigate]);

  return (
    <div>
      <h2>Trial Page</h2>
      <button onClick={openGoogleDocs}>Upload/Edit</button>
      <button onClick={goToAttendance}>Attendance</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default TrialPage;
