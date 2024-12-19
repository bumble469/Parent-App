import React, { useEffect, useState } from 'react';
import DataTable from 'examples/Tables/DataTable';
import MDTypography from 'components/MDTypography';
import { Card } from '@mui/material';
import MDBox from 'components/MDBox';

const MarksTable = ({ semester }) => {
  const [marksData, setMarksData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');

  // Fetch marks data for the selected semester
  const fetchMarksData = async (semester) => {
    try {
      const response = await fetch(`http://localhost:8001/api/performance/student/detailedmarks?semester=${semester}`);
      const data = await response.json();

      // Ensure data is an array before setting it
      if (Array.isArray(data)) {
        setMarksData(data);
      } else {
        console.error("Fetched data is not an array:", data);
      }
    } catch (error) {
      console.error("Error fetching marks data:", error);
    }
  };

  useEffect(() => {
    fetchMarksData(semester);
  }, [semester]);

  // Group data by subject and exam type
  const groupedMarksData = Array.isArray(marksData)
    ? marksData.reduce((acc, { subject_name, exam_type, marks_obtained, max_marks }) => {
        if (!acc[subject_name]) {
          acc[subject_name] = [];
        }
        acc[subject_name].push({ exam_type, marks_obtained, max_marks });
        return acc;
      }, {})
    : {};

  // Function to calculate grade based on total marks
  const calculateGrade = (totalMarks, maxMarks) => {
    const percentage = (totalMarks / maxMarks) * 100;
    if (percentage >= 80) return 'O';
    if (percentage < 80 && percentage >= 75) return 'A+';
    if (percentage < 75 && percentage >= 60) return 'A';
    if (percentage < 60 && percentage >= 55) return 'B+';
    if (percentage < 55 && percentage >= 50) return 'B';
    if (percentage < 50 && percentage >= 45) return 'C';
    if (percentage < 45 && percentage >= 35) return 'D';
    if (percentage < 35 ) return "F: ATKT"
    return 'F';
  };

  // Prepare table data: rows will be subjects, and columns will be exam types
  const marksTableData = Array.isArray(marksData)
    ? Object.keys(groupedMarksData).map(subject => {
        const subjectData = groupedMarksData[subject];
        let totalMarks = 0;
        let maxMarks = 0;
        const row = { subject };

        subjectData.forEach(({ exam_type, marks_obtained, max_marks }) => {
          totalMarks += marks_obtained;
          maxMarks += max_marks;
          row[exam_type] = `${marks_obtained}`; // Marks obtained for each exam type
        });

        row["total"] = `${totalMarks} / ${maxMarks}`; // Total marks
        row["grade"] = calculateGrade(totalMarks, maxMarks); // Grade based on total marks

        return row;
      })
    : [];

  // Filtered data based on selected subject
  const filteredMarksTableData = selectedSubject === 'All Subjects'
    ? marksTableData
    : marksTableData.filter(row => row.subject === selectedSubject);

  // Get unique subjects for the dropdown
  const subjects = ['All Subjects', ...new Set(marksTableData.map(row => row.subject))];

  // Get unique exam types across all subjects
  const uniqueExamTypes = Array.isArray(marksData)
    ? [...new Set(marksData.map(item => item.exam_type))] 
    : [];

  // Add total and grade columns to the columns configuration
  const marksColumns = [
    { Header: 'Subject', accessor: 'subject' },
    ...uniqueExamTypes.map(examType => ({
      Header: `${examType}`, // Column for each exam type
      accessor: examType,
    })),
    {
      Header: `Total`,
      accessor: 'total', // This column will display the total marks for each subject
    },
    {
      Header: `Grade`,
      accessor: 'grade', // This column will display the grade for each subject
    },
  ];

  // Calculate grand total and overall percentage
  const totalMarksAllSubjects = marksTableData.reduce((acc, row) => {
    const [marksObtained, marksTotal] = row.total.split(' / ').map(Number);
    return acc + marksObtained;
  }, 0);

  const maxMarksAllSubjects = marksTableData.reduce((acc, row) => {
    const [, marksTotal] = row.total.split(' / ').map(Number);
    return acc + marksTotal;
  }, 0);

  const overallPercentage = (totalMarksAllSubjects / maxMarksAllSubjects) * 100;
  const overallGrade = calculateGrade(totalMarksAllSubjects, maxMarksAllSubjects);

  return (
    <Card sx={{ paddingBottom: '10px' }}>
      <MDBox
        mx={2}
        mt={-3}
        py={3}
        px={2}
        variant="gradient"
        bgColor="success"
        borderRadius="lg"
        coloredShadow="success"
      >
        <MDTypography variant="h6" color="white">
          Marks Category-Wise
        </MDTypography>
      </MDBox>
      <MDBox pt={2} px={2}>
        {/* Subject Filter */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', gap: '10px' }}>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', fontSize: '14px', border: '1px solid #ddd', marginRight: '20px' }}
          >
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
        {/* Data Table */}
        <DataTable
          table={{ columns: marksColumns, rows: filteredMarksTableData }}
          isSorted={false}
          entriesPerPage={false}
          showTotalEntries={false}
          noEndBorder
        />
        <hr />
        <div style={{ fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '10px' }}>
          <p>Grand Total: {totalMarksAllSubjects} / {maxMarksAllSubjects}</p>
          <p>Overall Percentage: {overallPercentage.toFixed(2)}%</p>
          <p>Overall Grade: {overallGrade}</p>
        </div>
      </MDBox>
    </Card>
  );
};

export default MarksTable;
