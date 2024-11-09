import React, { useEffect, useState } from "react";
import { getClasses, getGrades, getStudentsByGradeAndClass, addAttendance } from "./../lib/actions";
import './style.css';

interface SchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherId: string | number;
}

const SchedulerModal: React.FC<SchedulerModalProps> = ({ isOpen, onClose, teacherId }) => {
  const [classes, setClasses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [noStudentsMessage, setNoStudentsMessage] = useState("");
  const [markAllPresent, setMarkAllPresent] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const fetchClasses = async () => {
        const response = await getClasses();
        if (response.success) {
          setClasses(response.data);
        } else {
          console.error("Failed to fetch classes");
        }
      };

      const fetchGrades = async () => {
        const response = await getGrades();
        if (response.success) {
          setGrades(response.data);
        } else {
          console.error("Failed to fetch grades");
        }
      };

      fetchClasses();
      fetchGrades();
    }
  }, [isOpen]);

  const handleShowStudents = async () => {
    const classId = parseInt(selectedClass, 10);
    const gradeId = parseInt(selectedGrade, 10);

    if (isNaN(classId) || isNaN(gradeId)) {
      setNoStudentsMessage("Please select both grade and class.");
      return;
    }

    const response = await getStudentsByGradeAndClass(gradeId, classId);
    if (response.success && response.data.length > 0) {
      setStudents(response.data.map(student => ({ ...student, isPresent: markAllPresent })));
      setNoStudentsMessage("");
      updateCounts(response.data);
    } else {
      setStudents([]);
      setNoStudentsMessage("Oops!! No students found in this class.");
    }
  };

  const handleAttendanceChange = (studentId: string, isPresent: boolean) => {
    setStudents((prevStudents) => {
      const updatedStudents = prevStudents.map((s) =>
        s.id === studentId ? { ...s, isPresent } : s
      );
      updateCounts(updatedStudents);
      return updatedStudents;
    });
  };

  const updateCounts = (updatedStudents) => {
    const presentCount = updatedStudents.filter((student) => student.isPresent).length;
    const absentCount = updatedStudents.length - presentCount;
    setPresentCount(presentCount);
    setAbsentCount(absentCount);
  };

  const handleSaveAttendance = async () => {
    const unmarkedStudents = students.filter(student => student.isPresent === undefined);

    if (unmarkedStudents.length > 0) {
      setConfirmationMessage("Mark attendance for all the students without fail.");
      setIsSuccess(false);
      setShowConfirmation(true);
      return;
    }

    const presentIds = students.filter(student => student.isPresent).map(student => student.id);
    const absentIds = students.filter(student => !student.isPresent).map(student => student.id);

    const attendanceData = {
      date: selectedDate,
      period: parseInt(selectedPeriod, 10),
      gradeId: parseInt(selectedGrade, 10),
      classId: parseInt(selectedClass, 10),
      supervisorId: teacherId,
      presentIds,
      absentIds,
    };

    try {
      const result = await addAttendance(attendanceData);
      if (result.success) {
        setConfirmationMessage("Attendance saved successfully!");
        setIsSuccess(true);
      } else {
        setConfirmationMessage("Something went wrong. Attendance could not be saved.");
        setIsSuccess(false);
      }
      setShowConfirmation(true);
    } catch (error) {
      setConfirmationMessage("Error saving attendance. Please try again.");
      setIsSuccess(false);
      setShowConfirmation(true);
    }
  };

  const handleMarkAllPresent = () => {
    setMarkAllPresent(!markAllPresent);
    setStudents((prevStudents) => {
      const updatedStudents = prevStudents.map(student => ({ ...student, isPresent: !markAllPresent }));
      updateCounts(updatedStudents);
      return updatedStudents;
    });
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    if (isSuccess) {
      onClose();
    }
  };

  if (!isOpen) return null;


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="form-section">
          <h3><b>Add Scheduler</b></h3>
          <form>
            <div className="form-group">
              <label>Grade</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                required
              >
                <option value="">Select Grade</option>
                {grades.map((grade: any) => (
                  <option key={grade.id.toString()} value={grade.id}>
                    {grade.level}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                required
              >
                <option value="">Select Class</option>
                {classes.map((classItem: any) => (
                  <option key={classItem.id.toString()} value={classItem.id}>
                    {classItem.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Period</label>
              <input
                type="number"
                placeholder="Enter Period"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                required
              />
            </div>
            <div className="modal-actions">
              <button type="button" onClick={handleShowStudents} className="btn btn-primary">
                Show Students
              </button>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div className="students-section">
         <div className="attendance-header">
            <h3><b>Mark Attendance</b></h3>
            {students.length > 0 && (
            <label className="mark-all-present">
              <input
                type="checkbox"
                checked={markAllPresent}
                onChange={handleMarkAllPresent}
              />
              &nbsp;Mark All Present
            </label>
            )}
          </div>
          <br/>
          {noStudentsMessage && <p><i>{noStudentsMessage}</i></p>}
          {students.length === 0 && !noStudentsMessage && (
            <p style={{ fontStyle: 'italic' }}>Student name will display here!</p>
          )}

          <div className="student-list">
            <ul>
              {students.map((student: any, index) => (
                <li key={student.id ? student.id.toString() : `student-${index}`} className="student-item">
                  <span>{student.name} {student.surname || ""}</span>
                  <div className="attendance-options">
                    <input
                      type="radio"
                      name={`attendance_${student.id}`}
                      className="present"
                      value="present"
                      checked={markAllPresent || student.isPresent || false}
                      onChange={() => handleAttendanceChange(student.id, true)} 
                     
                    />
                    <input
                      type="radio"
                      name={`attendance_${student.id}`}
                      className="absent"
                      value="absent"
                      disabled={markAllPresent}
                      onChange={() => handleAttendanceChange(student.id, false)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {students.length > 0 && (
  <div className="attendance-footer">
    <div className="attendance-counts">
      <h6>Presence: <b>{presentCount}</b></h6>
      <h6>Absence: <b>{absentCount}</b></h6>
    </div>
    <button
      type="button"
      className="save-attendance-btn"
      onClick={handleSaveAttendance}
    >
      Save
    </button>
  </div>
)}

        </div>
      </div>

     {/* Confirmation Modal */}
     {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <p>{confirmationMessage}</p>
            <button onClick={handleCloseConfirmation} className="confirmation-btn">
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulerModal;
