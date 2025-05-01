import { useState, useEffect } from "react";
import axios from "axios";

function GenTimeTable() {
  const [term, setTerm] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [generatedTable, setGeneratedTimeTable] = useState(null); // State to store generated timetable

  const timeSlots = [
    "8:30-9:25",
    "9:25-10:20",
    "10:35-11:30",
    "11:30-12:25",
    "12:25-1:15 (Lunch)",
    "1:15-2:10",
    "2:10-3:05",
    "3:05-4:00",
  ];

  //const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/mentors")
      .then((res) => setFacultyList(res.data))
      .catch((err) => console.error("Error fetching faculty:", err));
  }, []);

  useEffect(() => {
    if (term === "Odd") {
      setSemesters([
        { semester: "3", sections: [] },
        { semester: "5", sections: [] },
        { semester: "7", sections: [] },
      ]);
    } else if (term === "Even") {
      setSemesters([
        { semester: "4", sections: [] },
        { semester: "6", sections: [] },
        { semester: "8", sections: [] },
      ]);
    } else {
      setSemesters([]);
    }
  }, [term]);

  // Function to add a section
  const addSection = (semIndex) => {
    const updatedSemesters = semesters.map((sem, index) =>
      index === semIndex
        ? {
            ...sem,
            sections: [
              ...sem.sections,
              {
                section: "A", // Default section value
                subjects: [
                  { subCode: "", subName: "", subCredits: "", subFaculty: "" },
                ],
              },
            ],
          }
        : sem
    );
    setSemesters(updatedSemesters);
  };

  // Function to add a subject
  const addSubject = (semIndex, secIndex) => {
    const updatedSemesters = semesters.map((sem, i) =>
      i === semIndex
        ? {
            ...sem,
            sections: sem.sections.map((section, j) =>
              j === secIndex
                ? {
                    ...section,
                    subjects: [
                      ...section.subjects,
                      {
                        subCode: "",
                        subName: "",
                        subCredits: "",
                        subFaculty: "",
                      },
                    ],
                  }
                : section
            ),
          }
        : sem
    );
    setSemesters(updatedSemesters);
  };

  // Function to handle input changes for subjects
  const handleSubjectChange = (semIndex, secIndex, subIndex, field, value) => {
    const updatedSemesters = semesters.map((sem, i) => {
      if (i !== semIndex) return sem;
      return {
        ...sem,
        sections: sem.sections.map((section, j) => {
          if (j !== secIndex) return section;
          return {
            ...section,
            subjects: section.subjects.map((subject, k) =>
              k === subIndex ? { ...subject, [field]: value } : subject
            ),
          };
        }),
      };
    });
    setSemesters(updatedSemesters);
  };

  const generateTimeTable = () => {
    let timetable = {};
    let facultySchedule = {};

    semesters.forEach((semSec) => {
      semSec.sections.forEach((section) => {
        let weeklySchedule = {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
        };
        let facultyHours = {};

        section.subjects.forEach((subject) => {
          const { subCode, subName, subCredits, subFaculty } = subject;
          let totalHours = subCredits === "3" ? 5 : subCredits === "4" ? 4 : 0;
          let labHours = subCredits === "4" ? 3 : subCredits === "1" ? 3 : 0;

          if (!facultyHours[subFaculty]) facultyHours[subFaculty] = 0;
          if (!facultySchedule[subFaculty])
            facultySchedule[subFaculty] = {
              Monday: [],
              Tuesday: [],
              Wednesday: [],
              Thursday: [],
              Friday: [],
            };

          let allocatedPeriods = 0;
          let availableDays = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ].sort(() => Math.random() - 0.5);

          availableDays.forEach((day) => {
            timeSlots.forEach((slot) => {
              if (
                allocatedPeriods < totalHours &&
                !facultySchedule[subFaculty][day].includes(slot)
              ) {
                weeklySchedule[day].push(
                  `${slot}: ${subCode} - ${subName} (${subFaculty})`
                );
                facultySchedule[subFaculty][day].push(slot);
                facultyHours[subFaculty]++;
                allocatedPeriods++;
              }
            });
          });

          if (labHours > 0) {
            let labDays = ["Monday", "Wednesday", "Friday"].sort(
              () => Math.random() - 0.5
            );
            labDays.forEach((day) => {
              if (!facultySchedule[subFaculty][day].includes("8:30-11:30")) {
                weeklySchedule[day].push(
                  `Lab (8:30-11:30) ${subCode} - ${subName} (${subFaculty})`
                );
                facultySchedule[subFaculty][day].push("8:30-11:30");
                facultyHours[subFaculty] += 3;
              }
            });
          }
        });

        timetable[`Semester ${semSec.semester} - Section ${section.section}`] =
          weeklySchedule;
      });
    });

    setGeneratedTimeTable(timetable);
  };

  // Function to handle section selection change
  const handleSectionChange = (semIndex, secIndex, value) => {
    const updatedSemesters = semesters.map((sem, i) => {
      if (i !== semIndex) return sem;
      return {
        ...sem,
        sections: sem.sections.map((section, j) =>
          j === secIndex ? { ...section, section: value } : section
        ),
      };
    });
    setSemesters(updatedSemesters);
  };

  // Function to generate and display the time table

  return (
    <div>
      <h1>Generate Time Table</h1>
      <label>Term:</label>
      <select onChange={(e) => setTerm(e.target.value)} value={term}>
        <option value="">Select Term</option>
        <option value="Odd">Odd</option>
        <option value="Even">Even</option>
      </select>

      {semesters.map((semSec, semIndex) => (
        <div key={semIndex}>
          <h2>Semester {semSec.semester}</h2>
          <button onClick={() => addSection(semIndex)}>Add Section</button>

          {semSec.sections.map((section, secIndex) => (
            <div key={secIndex}>
              <h3>
                Section:{" "}
                <select
                  value={section.section}
                  onChange={(e) =>
                    handleSectionChange(semIndex, secIndex, e.target.value)
                  }
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </h3>

              <h4>Subjects</h4>
              {section.subjects.map((subject, subIndex) => (
                <div key={subIndex}>
                  <input
                    type="text"
                    placeholder="Subject Code"
                    value={subject.subCode}
                    onChange={(e) =>
                      handleSubjectChange(
                        semIndex,
                        secIndex,
                        subIndex,
                        "subCode",
                        e.target.value
                      )
                    }
                  />
                  <input
                    type="text"
                    placeholder="Subject Name"
                    value={subject.subName}
                    onChange={(e) =>
                      handleSubjectChange(
                        semIndex,
                        secIndex,
                        subIndex,
                        "subName",
                        e.target.value
                      )
                    }
                  />
                  <select
                    onChange={(e) =>
                      handleSubjectChange(
                        semIndex,
                        secIndex,
                        subIndex,
                        "subCredits",
                        e.target.value
                      )
                    }
                    value={subject.subCredits}
                  >
                    <option value="">Select Credits</option>
                    <option value="1">1</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                  <select
                    onChange={(e) =>
                      handleSubjectChange(
                        semIndex,
                        secIndex,
                        subIndex,
                        "subFaculty",
                        e.target.value
                      )
                    }
                    value={subject.subFaculty}
                  >
                    <option value="">Select Faculty</option>
                    {facultyList.map((faculty) => (
                      <option key={faculty._id} value={faculty.name}>
                        {faculty.name}
                      </option>
                    ))}
                  </select>
                  <button onClick={() => addSubject(semIndex, secIndex)}>
                    Add Subject
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}

      {/* Generate Time Table Button */}
      <button onClick={generateTimeTable}>Generate Time Table</button>

      {/* Display the Generated Time Table */}
      {generatedTable && (
        <div>
          <h2>Generated Time Table</h2>
          {Object.entries(generatedTable).map(([key, schedule], semIndex) => (
            <div key={semIndex}>
              <h3>{key}</h3>
              <table border="1" cellPadding="5" cellSpacing="0">
                <thead>
                  <tr>
                    <th>Time Slots</th>
                    <th>Monday</th>
                    <th>Tuesday</th>
                    <th>Wednesday</th>
                    <th>Thursday</th>
                    <th>Friday</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    "8:30-9:25",
                    "9:25-10:20",
                    "10:35-11:30",
                    "11:30-12:25",
                    "12:25-1:15 (Lunch)",
                    "1:15-2:10",
                    "2:10-3:05",
                    "3:05-4:00",
                  ].map((slot, slotIndex) => (
                    <tr key={slotIndex}>
                      <td>{slot}</td>
                      {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                      ].map((day, dayIndex) => (
                        <td key={dayIndex}>
                          {schedule[day].find((s) => s.startsWith(slot)) || "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GenTimeTable;
