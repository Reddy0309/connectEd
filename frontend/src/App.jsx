import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ParentPage from './pages/ParentPage'; // Blank Page for now
import MentorPage from './pages/MentorPage'; // Blank Page for now
import TrialPage from './pages/trialPage';
import LoginPage1 from './pages/mentorLogin';
import Attendance from './pages/attendance';
import AddAttendance from './pages/addattendance';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admin" element={< AdminPage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/parent" element={<ParentPage />} />
        <Route path="/mentor" element={<MentorPage />} />
        <Route path="/trial" element={<TrialPage />} />
        <Route path="/mentorLogin" element={<LoginPage1 />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/add-attendance" element={<AddAttendance />} />
        
      </Routes>
    </Router>
  );
}

export default App;
