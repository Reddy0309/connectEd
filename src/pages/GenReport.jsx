import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const generatePDF = async (headers, studentDetails, setPdfMap=()=>{}) => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  const pageHeight = 841.89; // A4 size
  const margin = 50;
  let yPosition = 800;

  // Remove Sl. No
  const filteredHeaders = headers.slice(1);
  const filteredDetails = studentDetails.slice(1);

  // Extract USN separately
  const usn = filteredDetails[0] || "N/A"; // Ensure it's never undefined

  let page = pdfDoc.addPage([595.28, pageHeight]); // Create first page

  // Title
  page.drawText("Student Report", {
    x: margin,
    y: yPosition,
    size: 14,
    font,
    color: rgb(0, 0, 0),
  });

  yPosition -= 25;

  // USN
  page.drawText(`USN: ${usn}`, {
    x: margin,
    y: yPosition,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  yPosition -= 20;

  // Write details with line breaks
  for (let i = 1; i < filteredHeaders.length; i++) {
    const key = filteredHeaders[i] || ""; // Empty string if undefined
    const value = filteredDetails[i] || ""; // Empty string if undefined

    // If both key & value are empty, insert a blank line
    if (!key.trim() && !value.trim()) {
      yPosition -= 20; // Insert an empty space
      continue;
    }

    const text = `${key}: ${value}`;

    // Check space, create new page if needed
    if (yPosition < 50) {
      page = pdfDoc.addPage([595.28, pageHeight]);
      yPosition = 800;
    }

    page.drawText(text, {
      x: margin,
      y: yPosition,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    yPosition -= 20;
  }

  // Save and download PDF
  const pdfBytes = await pdfDoc.save();
  setPdfMap((prev) => ({ ...prev, [usn]: pdfBytes }));
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `Student_Report_${usn}.pdf`;
  link.click();

  return { pdfBytes, usn };
};

const sendReportToParent = async (usn,pdfBytes, headers, studentDetails) => {
  try {
    const mentorName = localStorage.getItem("mentorName");
    const pdfDoc = await PDFDocument.create();
     const blob = new Blob([pdfBytes], { type: "application/pdf" });
     const file = new File([blob], `Student_Report_${usn}.pdf`, {
       type: "application/pdf",
     });
    const page = pdfDoc.addPage([595.28, 841.89]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    let yPosition = 800;

    page.drawText(`USN: ${usn}`, {
      x: 50,
      y: yPosition,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    yPosition -= 15;

    for (let i = 1; i < headers.length; i++) {
      const key = headers[i];
      const value = studentDetails[i];
      if (key && value) {
        page.drawText(`${key}: ${value}`, {
          x: 50,
          y: yPosition,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        yPosition -= 15;
      }
    }

    const formData = new FormData();
    formData.append("usn", usn);
    formData.append("mentorName", mentorName);
    formData.append("file", file);

//     const pdfBytes = await pdfDoc.save();
// // const link = document.createElement("a");
//  const base64PDF = btoa(String.fromCharCode(...new Uint8Array(pdfBytes)));
// //const user = localStorage.getItem("mentorName");

    const response = await axios.post("/api/report/upload-report1", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Report sent to parent successfully.");
    console.log(response.data);
  } catch (error) {
    console.error("Error sending report:", error);
    alert("Failed to send report to parent.");
  }
};


const GenReport = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const students = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (students.length > 1) {
        setHeaders(students[0]);
        setStudentsData(students.slice(1));
      } else {
        alert("The Excel file is empty or formatted incorrectly.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    const user = localStorage.getItem("email");
    if (!user) {
      alert("Please login first!");
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="center-content">
      <h2>Generate Report</h2>
      <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
      <p>Select an Excel file to generate the report.</p>
      <button onClick={() => navigate("/trial")}>Go Back</button>
      <p>
        <b>
          Scroll down to Generate and Download Reports in PDF format and send
          reports to parents.
        </b>
      </p>
      {studentsData.map((student, index) => (
        <div key={index} className="student-container">
          <p>{`Student ${index + 1}: ${student.join(", ")}`}</p>
          {/* <button onClick={() => generatePDF(headers, student)}>
            Generate PDF
          </button> */}
          <button
            onClick={async () => {
              const result = await generatePDF(headers, student, () => {});
              if (result?.pdfBytes && result?.usn) {
                await sendReportToParent(
                  result.usn,
                  result.pdfBytes,
                  headers,
                  student
                );
              }
            }}
          >
            Download Report and Send Report to Parent
          </button>
        </div>
      ))}
    </div>
  );
};

export default GenReport;
