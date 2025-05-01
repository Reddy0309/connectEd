import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMentorByEmail, fetchParents } from "../services/api";

const MenteesPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [mentees, setMentees] = useState([]);
  const [mentorId, setMentorId] = useState(null); // ✅ Store mentor ID

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (!token) {
      alert("Please login first!");
      setIsAuthenticated(false);
      navigate("/");
      return;
    }

    const getMentees = async () => {
      try {
        // Fetch mentor details using the email
        const mentorData = await fetchMentorByEmail(email);
        if (!mentorData) {
          alert("Mentor details not found!");
          return;
        }

        setMentorId(mentorData._id); // ✅ Store mentor ID

        // Fetch all parents and filter based on mentor's name
        const parentsData = await fetchParents();
        const filteredMentees = parentsData.filter(
          (parent) => parent.mentorName === mentorData.name
        );
        setMentees(filteredMentees);
      } catch (error) {
        console.error("Error fetching mentees:", error);
        alert("Failed to load mentees.");
      }
    };

    getMentees();
  }, [navigate]);

  if (!isAuthenticated) {
    return null; // Prevents rendering if user is redirected
  }

  return (
    <div>
      <h2>Students Under Your Mentorship</h2>
      <button onClick={() => navigate("/trial")}>Go Back</button>
      {mentees.length > 0 ? (
        <table border="1">
          <thead>
            <tr>
              <th>Serial No.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Talk</th>
            </tr>
          </thead>
          <tbody>
            {mentees.map((mentee, index) => (
              <tr key={mentee._id}>
                <td>{index + 1}</td>
                <td>{mentee.name}</td>
                <td>{mentee.email}</td>
                <td>
                  {mentorId ? (
                    <button
                      onClick={() =>
                        navigate(`/chat/${mentorId}/${mentee._id}`)
                      }
                    >
                      Talk
                    </button>
                  ) : (
                    "Loading..."
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No mentees found.</p>
      )}
      <button onClick={() => navigate("/trial")}>Go Back</button>
    </div>
  );
};

export default MenteesPage;
