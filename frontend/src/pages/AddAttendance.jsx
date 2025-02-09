import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function AddAttendance() {
  const [file, setFile] = useState(null);
  const [collectionName, setCollectionName] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !collectionName.trim()) {
      alert('Please enter a valid collection name and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('collectionName', collectionName);

    console.log('Sending file:', file);
  console.log('Sending FormData:', [...formData.entries()]);

    try {
      const response = await axios.post('http://localhost:5000/api/upload/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data',
          Accept: 'application/json'
         },
      });

      alert(response.data.message);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('File upload failed.');
    }
  };
const navigate = useNavigate();
  return (
    <div>
      <h2>Upload Attendance Data</h2>
      <input
        type="text"
        placeholder="Enter class name (e.g., 5A)"
        value={collectionName}
        onChange={(e) => setCollectionName(e.target.value)}
      />
      <br />
      <input type="file" accept=".xlsx" onChange={handleFileChange} />
      <br />
      <button onClick={handleUpload}>Upload</button>
      <button onClick={() => navigate('/admin')}>Go Back</button>
    </div>
  );
}

export default AddAttendance;
