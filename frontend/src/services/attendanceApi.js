import axios from "axios";

const API_URL = "http://localhost:5000/api/attendance";

export const fetchAttendanceData = async (collectionName) => {
  try {
    const response = await axios.get(`${API_URL}/${collectionName}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    return [];
  }
};
