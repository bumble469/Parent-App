import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataTable from 'examples/Tables/DataTable';
import MDTypography from 'components/MDTypography';
import { Card } from '@mui/material';
import MDBox from 'components/MDBox';
import loading_image from '../../../assets/images/icons8-loading.gif';
import axios from 'axios';
const MarksTable = ({ prn, semester }) => {
  const { t, i18n } = useTranslation(); 
  const [marksData, setMarksData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(t('All Subjects'));
  const [isLoading, setIsLoading] = useState(true); // New loading state

  const fetchMarksData = async (semester) => {
    try {
      const response = await axios.post('https://parent-rest-api.onrender.com/api/performance/student/detailedmarks',{
        prn:prn,
        semester:semester
      });
      const data = await response.data;

      if (Array.isArray(data)) {
        setMarksData(data);
      } else {
        console.error("Fetched data is not an array:", data);
      }
      setIsLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.error("Error fetching marks data:", error);
      setIsLoading(false); // Set loading to false even if there's an error
    }
  };

  useEffect(() => {
    fetchMarksData(semester);
  }, [semester]);

  const groupedMarksData = Array.isArray(marksData)
    ? marksData.reduce((acc, { subject_name, exam_type, marks_obtained, max_marks }) => {
        if (!acc[subject_name]) {
          acc[subject_name] = [];
        }
        acc[subject_name].push({ exam_type, marks_obtained, max_marks });
        return acc;
      }, {})
    : {};

  const calculateGrade = (totalMarks, maxMarks) => {
    if (isNaN(totalMarks) || isNaN(maxMarks) || maxMarks === 0) return 'NaN';
    const percentage = (totalMarks / maxMarks) * 100;
    if (percentage >= 80) return 'O';
    if (percentage >= 75) return 'A+';
    if (percentage >= 60) return 'A';
    if (percentage >= 55) return 'B+';
    if (percentage >= 50) return 'B';
    if (percentage >= 45) return 'C';
    if (percentage >= 35) return 'D';
    return "F: ATKT";
  };

  const marksTableData = Array.isArray(marksData)
    ? Object.keys(groupedMarksData).map(subject => {
        const subjectData = groupedMarksData[subject];
        let totalMarks = 0;
        let maxMarks = 0;
        const row = { subject };

        subjectData.forEach(({ exam_type, marks_obtained, max_marks }) => {
          totalMarks += marks_obtained;
          maxMarks += max_marks;
          row[exam_type] = `${marks_obtained}`;
        });

        row["total"] = `${totalMarks} / ${maxMarks}`;
        row["grade"] = calculateGrade(totalMarks, maxMarks);

        return row;
      })
    : [];

  const filteredMarksTableData = selectedSubject === t('All Subjects')
    ? marksTableData
    : marksTableData.filter(row => row.subject === selectedSubject);

  const subjects = [t('All Subjects'), ...new Set(marksTableData.map(row => row.subject))];

  const uniqueExamTypes = Array.isArray(marksData)
    ? [...new Set(marksData.map(item => item.exam_type))]
    : [];

  const marksColumns = [
    { Header: t('subject'), accessor: 'subject' },
    ...uniqueExamTypes.map(examType => ({
      Header: `${examType}`,
      accessor: examType,
    })),
    {
      Header: t('Total'),
      accessor: 'total',
    },
    {
      Header: t('OverallGrade'),
      accessor: 'grade',
    },
  ];

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

  useEffect(() => {
    setSelectedSubject(t('All Subjects'));
  }, [i18n.language, t]);

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
          {t('MarksCategoryWise')}
        </MDTypography>
      </MDBox>
      <MDBox pt={2} px={2}>
        {isLoading ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <img src={loading_image} alt={t('loading')} style={{ width: '50px', height: '50px' }} />
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', gap: '10px' }}>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={{ padding: '8px', borderRadius: '4px', fontSize: '0.95rem', border: '1px solid #ddd', marginRight: '20px' }}
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            <DataTable
              table={{ columns: marksColumns, rows: filteredMarksTableData }}
              isSorted={false}
              entriesPerPage={false}
              showTotalEntries={false}
              noEndBorder
            />
            <hr />
            <div style={{ fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '10px' }}>
              <p>{t('TotalMarks')}: {totalMarksAllSubjects} / {maxMarksAllSubjects}</p>
              <p>{t('OverallPercentage')}: {overallPercentage.toFixed(2)}%</p>
              <p>{t('OverallGrade')}: {overallGrade}</p>
            </div>
          </>
        )}
      </MDBox>
    </Card>
  );
};

export default MarksTable;
