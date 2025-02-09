//AttandanceTable.jsx

import PropTypes from "prop-types";

const AttendanceTable = ({ data, onStatusChange, onValidityChange }) => {

  return (
    <table border="1">
      <thead>
        <tr>
          <th>USN</th>
          <th>Name</th>
          <th>Mail ID</th>
          <th>Status</th>
          <th>Validity</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="5">No records found</td>
          </tr>
        ) : (
          data.map((student, index) => (
            <tr key={index}>
              <td>{student.USN || "N/A"}</td>
              <td>{student.NAME || "N/A"}</td>
              <td>{student.EMAIL || "N/A"}</td>
              
              {/* Status Column */}
              <td>
                <input
                  type="checkbox"
                  checked={student.status || false}
                  onChange={() => onStatusChange(index)} // Use parent's function to update status
                  id={`status-checkbox-${index}`}
                />
                <label htmlFor={`status-checkbox-${index}`}>
                  {student.status ? "Absent" : "Present"}
                </label>
              </td>

              {/* Validity Column */}
              <td>
                <input
                  type="checkbox"
                  checked={student.validity || false}
                  onChange={() => onValidityChange(index)} // Use parent's function to update validity
                  id={`validity-checkbox-${index}`}
                  
                />
                <label htmlFor={`validity-checkbox-${index}`}>Submitted</label>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

// ✅ Add PropTypes Validation
AttendanceTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      USN: PropTypes.string,
      NAME: PropTypes.string,
      EMAIL: PropTypes.string,
      status: PropTypes.bool,
      validity: PropTypes.bool,
    })
  ).isRequired,
  onStatusChange: PropTypes.func.isRequired, // Parent function for status change
  onValidityChange: PropTypes.func.isRequired, // Parent function for validity change
};


export default AttendanceTable;
