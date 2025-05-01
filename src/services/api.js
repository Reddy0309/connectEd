import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend URL
});

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post('/auth/login', userData);
   console.log("Login Response Data:", response.data);
  return response.data;
};

export const fetchMentors = async () => {
  try {
    const response = await api.get('/mentors'); // Now it correctly uses baseURL
    return response.data || [];
  } catch (error) {
    console.error('Error fetching mentors:', error);
    return [];
  }
};

export const fetchMentorByEmail = async (email) => {
  if (!email) {
    console.error("fetchMentorByEmail called without email!");
    throw new Error("Email is required to fetch mentor details.");
  }
  
  const response = await api.get(`/mentors/${email}`); // Ensure this matches your backend route
  return response.data;
};

export const fetchParents = async () => {
  try {
    const response = await api.get('/parents');
    console.log("Fetched Parents:", response.data); // Log the fetched data
    return response.data || [];
  } catch (error) {
    console.error('Error fetching parents:', error);
    return [];
  }
};

export const fetchMessages = async (menteeId) => {
  const response = await api.get(`/chat/${menteeId}`);
  return response.data;
};

export const sendMessage = async (message) => {
  const response = await api.post("/chat/send", message);
  return response.data;
};



export default api;
