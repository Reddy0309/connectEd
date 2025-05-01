import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios";

const ParentDash = () => {
  const [parentDetails, setParentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const fetchParentDetails = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token
        const userEmail = localStorage.getItem("email"); // Retrieve email

        if (!userEmail) {
          setError("User email not found.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/parent?email=${userEmail}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setParentDetails(response.data);
        console.log("Parent Details:", response.data);
        localStorage.setItem("usn", response.data.usn);
        localStorage.setItem("mentor", response.data.mentorName);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch parent details.");
      } finally {
        setLoading(false);
        
      }
    };

    fetchParentDetails();
  }, []);

  // 🔹 Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    localStorage.removeItem("email"); // Remove email
    localStorage.removeItem("usn"); // Remove email
    localStorage.clear(); // Clear all local storage items
    navigate("/"); // Redirect to login page
  };

  const handleViewReport = () => {
    if (parentDetails) {
      navigate("/viewreport");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">
        Parent Dashboard
      </h2>

      {parentDetails ? (
        <div>
          <p>
            <strong>Student Name:</strong> {parentDetails.name}
          </p>
          <p>
            <strong>Email:</strong> {parentDetails.email}
          </p>
          <p>
            <strong>Student USN:</strong> {parentDetails.usn}
          </p>
        </div>
      ) : (
        <p>No details found.</p>
      )}
      <button
        onClick={handleViewReport}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        View Report
      </button>
      {/* 🔹 Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default ParentDash;
