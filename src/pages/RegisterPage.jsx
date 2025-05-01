import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, fetchMentors } from "../services/api";
import axios from "axios";

function RegisterPage() {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "mentor", // Default role
    usn: "",
    mentorName: "",
  });

  useEffect(() => {
    const loadMentors = async () => {
      try {
        const response = await fetchMentors();
        if (Array.isArray(response)) {
          setMentors(response);
        } else {
          console.error("Unexpected response format:", response);
          setMentors([]); // Ensure it's always an array
        }
      } catch (error) {
        console.error("Error fetching mentors:", error);
        setMentors([]); // Set empty array on error
      }
    };
    loadMentors();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileSelect = () => {
    document.getElementById("fileInput").click(); // Programmatically open file input
  };

  // ✅ Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload-students",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // ✅ Ensure correct content type
          },
        }
      );
      console.log("Upload successful", response.data);
      alert("File uploaded successfully!");
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      alert("Error uploading file");
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData };

      if (formData.role === "mentor") {
        delete dataToSend.usn; // Remove USN for mentors
        delete dataToSend.mentorName; // Remove mentorName for mentors
      } else if (formData.role === "parent") {
        if (!formData.mentorName) {
          alert("Mentor Name is required for parents");
          return;
        }
        if (!formData.usn) {
          alert("USN is required for parents");
          return;
        }
      }

      await registerUser(dataToSend);
      alert("User registered successfully");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Error registering user");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="mentor">Mentor</option>
          <option value="parent">Parent</option>
        </select>

        {/* Show USN field only if role is 'parent' */}
        {formData.role === "parent" && (
          <input
            type="text"
            name="usn"
            value={formData.usn}
            onChange={handleChange}
            placeholder="USN"
            required
          />
        )}

        {/* Show Mentor dropdown only if role is 'parent' */}
        {formData.role === "parent" &&
          (mentors.length > 0 ? (
            <select
              name="mentorName"
              value={formData.mentorName}
              onChange={handleChange}
              required
            >
              <option value="">Select Mentor</option>
              {mentors.map((mentor) => (
                <option key={mentor._id} value={mentor.name}>
                  {mentor.name}
                </option>
              ))}
            </select>
          ) : (
            <p>Loading mentors...</p> // Message while fetching mentors
          ))}

        <button type="submit">Register</button>
      </form>
      <input
        type="file"
        id="fileInput"
        accept=".xlsx, .csv"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* ✅ Upload Button */}
      <button
        onClick={handleFileSelect}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
      >
        Upload Students Excel File
      </button>

      {file && (
        <div>
          <p>Selected File: {file.name}</p>
          <button
            onClick={handleUpload}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Upload File
          </button>
        </div>
      )}
      <button
        onClick={() => navigate("/admin")}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
      >
        Go Back
      </button>
    </div>
  );
}

export default RegisterPage;
