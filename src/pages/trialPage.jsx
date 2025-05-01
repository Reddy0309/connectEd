import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMentorByEmail } from "../services/api";
const TrialPage = () => {
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);

  const openGoogleDocs = () => {
    window.open(
      "https://accounts.google.com/AccountChooser?continue=https://drive.google.com",
      "_blank"
    );
  };

  const goToAttendance = () => {
    navigate("/attendance"); // Redirect to Attendance Page
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token
    localStorage.removeItem("email");
    localStorage.removeItem("user");
    localStorage.removeItem("mentorName");
    localStorage.clear(); // Clear all local storage items
    alert("Logged out successfully!");
    navigate("/"); // Redirect to login page
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = JSON.parse(localStorage.getItem("user"));
    console.log("Retrieved email:", email);

    if (!token) {
      alert("Please login first!");
      navigate("/"); // Redirect to login page if not authenticated
      return;
    }
    if (!email) {
      console.error("No email found in localStorage");
      alert("No email found. Please log in again.");
      navigate("/");
      return;
    }
    const getMentorDetails = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const userEmail = storedUser?.email; // Retrieve email from localStorage

        if (!userEmail) {
          console.error("No email found in localStorage");
          alert("No email found. Please log in again.");
          return;
        }

        const mentorData = await fetchMentorByEmail(userEmail);
        setMentor(mentorData);
      } catch (error) {
        console.error("Error fetching mentor details:", error);
        alert("Failed to load mentor details.");
      }
    };

    getMentorDetails();
  }, [navigate]);

  useEffect(() => {
    if (mentor?.name) {
      localStorage.setItem("mentorName", mentor.name);
    }
  }, [mentor?.name]);

  const generateReport = () => {
    navigate("/genReport"); // Redirect to Report Generation Page
  };

  const goToMenteesList = () => {
    navigate("/mentees"); // Redirect to Mentees List Page
  };

  return (
    <div>
      <h2>Trial Page</h2>
      {mentor ? (
        <div>
          <p>
            <strong>Name:</strong> {mentor.name}
          </p>
          <p>
            <strong>Email:</strong> {mentor.email}
          </p>
        </div>
      ) : (
        <p>Loading mentor details...</p>
      )}
      <button onClick={openGoogleDocs}>Upload/Edit</button>
      <button onClick={goToAttendance}>Attendance</button>
      <button onClick={goToMenteesList}>See Mentees List</button>
      <button onClick={generateReport}>Generate Report</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default TrialPage;
