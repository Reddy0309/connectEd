import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ViewReport = () => {
  const [pdfReports, setPdfReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const studentUSN = localStorage.getItem("usn");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        if (!studentUSN) {
          setError("Invalid student USN.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/report/fetch-report/${studentUSN}`,
          { responseType: "blob" } // IMPORTANT: get file as blob
        );

        // Save blob in state for download
        setPdfReports([
          {
            usn: studentUSN,
            mentorName: "Mentor Name", // You can fetch mentorName separately if needed
            fileBlob: response.data,
          },
        ]);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Failed to fetch reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [studentUSN]);


  if (loading) return <p>Loading reports...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

const downloadPDF = (fileBlob) => {
  try {
    const url = URL.createObjectURL(fileBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Student_Report.pdf";
    link.click();
    URL.revokeObjectURL(url); // Cleanup
  } catch (error) {
    console.error("Error downloading the PDF:", error);
    alert("There was an error downloading the report.");
  }
};



  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Student Report</h2>

      {pdfReports.length > 0 ? (
        <div className="mb-4 p-4 border rounded bg-gray-100 shadow">
          {/* <p className="mb-2 font-medium text-gray-700">
            Mentor: {pdfReports[0].mentorName}
          </p> */}
          <p className="mb-2 font-medium text-gray-700">
            USN: {pdfReports[0].usn}
          </p>
          <button
            onClick={() => downloadPDF(pdfReports[0].fileBlob)}
            className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Download Report
          </button>
        </div>
      ) : (
        <p className="text-red-500">No reports found.</p>
      )}

      <button
        onClick={() => navigate("/parentdash")}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default ViewReport;
