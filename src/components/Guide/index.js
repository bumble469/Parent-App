import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, Button, Typography, Box, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import dashboard_image from '../../assets/images/snapshots/dashboard/dashboard.png';
import overallAttendance_image from '../../assets/images/snapshots/dashboard/overallAttendance.png';
import overallPerformance_image from '../../assets/images/snapshots/dashboard/overallPerformance.png';
import rating_image from '../../assets/images/snapshots/dashboard/rating.png';
import subjectWiseAttendance_image from '../../assets/images/snapshots/dashboard/subjectWiseAttendanceGraph.png';
import subjectWisePerformance_image from '../../assets/images/snapshots/dashboard/subjectWiseMarksGraph.png';
import strongSubjects_image from '../../assets/images/snapshots/dashboard/strongSubjects.png';
import weakSubjects_image from '../../assets/images/snapshots/dashboard/weakSubjects.png';
import lowAttendanceSubjects_image from '../../assets/images/snapshots/dashboard/lowAttendanceSubjects.png';
import upcomingEvents_image from '../../assets/images/snapshots/dashboard/upcomingEvents.png';
import overall_attendance_performance from '../../assets/images/snapshots/performance/Overall-attendance.png';
import average_grade_performance from '../../assets/images/snapshots/performance/Average-grade.png';
import extra_curricular_activities_performance from '../../assets/images/snapshots/performance/Extra-curricular-activities.png';
import subject_wise_detailed_lecture_review_performance from '../../assets/images/snapshots/performance/Subject-wise-detailed-lecture-review.png';
import subject_wise_detailed_attendance_performance from '../../assets/images/snapshots/performance/Subject-wise-detailed-attendance.png';
import subject_wise_graph_visualization_of_attendance_performance from '../../assets/images/snapshots/performance/Subject-wise-graph-visualization-of-attendance.png';
import marks_category_wise_performance from '../../assets/images/snapshots/performance/Marks_category-wise.png';
import Graph_visualization_of_marks_by_category_wise from '../../assets/images/snapshots/performance/Graph-visualization-of-marks-by-category-wise.png';
import select_semester_performance from '../../assets/images/snapshots/performance/Select-semester.png';
import overiew_performance from '../../assets/images/snapshots/performance/Overview.png';
import faculty_page_image   from '../../assets/images/snapshots/Faculty/Faculty.png';
import chat_page_image from '../../assets/images/snapshots/Chat/chat.png';
import feedback_page_image from '../../assets/images/snapshots/Feedback/feedback.png';
import student_profile_page_image from '../../assets/images/snapshots/Student-profile/student-profile.png';
import attendance_image from '../../assets/images/snapshots/Future_Insights/attendance.jpg';
import marks_image from '../../assets/images/snapshots/Future_Insights/Marks.jpg';
import { useTranslation } from "react-i18next";

const GuideModal = ({ isOpen, onClose = () => {} }) => {
  const [selectedContentIndex, setSelectedContentIndex] = useState(0);
  const {t} = useTranslation();

  const guides = [
    {
      title: t("Dashboard"),
      content: [
        {
          subheading: t("Overview"),
          text: [
            t("The Dashboard page gives an overview of the student's current semester's progress. Includes attendance, performance, strong or weak points, low attendance, and upcoming events."),
          ],
          image: dashboard_image,
        },
        {
          subheading: t("Overall Attendance"),
          text: [
            t("This Overall Attendance shows the average attendance of all the subjects until now."),
            t("If the attendance is below 75%, then the parent must take action."),
          ],
          image: overallAttendance_image,
        },
        {
          subheading: t("Overall Performance"),
          text: [
            t("This shows the overall percentage of the student based on marks obtained up till now."),
            t("If the percentage is below 60%, then the parent must take action."),
            t("This will be visible only after an exam has been conducted otherwise nothing is there to show!"),
          ],
          image: overallPerformance_image,
        },
        {
          subheading: t("Rating"),
          text: [
            t("This is an out-of-5 metric that combines current performance and attendance."),
            t("It works on the criteria of 60% marks and 40% attendance."),
          ],
          image: rating_image,
        },
        {
          subheading: t("Subject-Wise Attendance Bar Graph"),
          text: [
            t("A subject-wise graphical view of how much attendance has been taken in each subject."),
            t("A parent can easily see which subject is being neglected by the student and by how much."),
            t("It displays the lectures attended and total lectures in each subject."),
          ],
          image: subjectWiseAttendance_image,
        },
        {
          subheading: t("Subject-Wise Performance Line Graph"),
          text: [
            t("This shows the marks obtained in all types of exams in each subject."),
            t("It will be visible only after an exam has been conducted otherwise nothing is there to show!"),
          ],
          image: subjectWisePerformance_image,
        },
        {
          subheading: t("Strong Subjects"),
          text: [
            t("The subjects above 80% are considered strong subjects."),
            t("Visible only after an exam has been conducted otherwise nothing is there to show!"),
          ],
          image: strongSubjects_image,
        },
        {
          subheading: t("Weak Subjects"),
          text: [
            t("The subjects below 75% are considered weak subjects."),
            t("Visible only after an exam has been conducted otherwise nothing is there to show!"),
          ],
          image: weakSubjects_image,
        },
        {
          subheading: t("Low Attendance Subjects"),
          text: [
            t("Subjects below 75% attendance are considered low attendance subjects."),
            t("Action must be taken by the parent to improve the attendance in that subject."),
          ],
          image: lowAttendanceSubjects_image,
        },
        {
          subheading: t("Upcoming Events"),
          text: [
            t("This shows the upcoming events in the college including timetables, exams, etc."),
          ],
          image: upcomingEvents_image,
        },
      ],
    },
    {
      title: t("Performance"),
      content: [
        {
          subheading: t("Overview"),
          text: [
            t("The Performance page gives in detail information about all the past as well as current semester"),
            t("It includes overall attendance, marks, lecture video review, detailed attendance, detailed marks."),
          ],
          image: overiew_performance,
        },
        {
          subheading: t("Semester Selection"),
          text: [
            t("This allows parents to select semester"),
            t("Data corresponding to that semester will be visible."),
          ],
          image: select_semester_performance,
        },
        {
          subheading: t("Overall Attendance"),
          text: [
            t("It will display the overall attendance for all subjects in the selected semester."),
          ],
          image: overall_attendance_performance,
        },
        {
          subheading: t("Average Grade"),
          text: [
            t("It will display the overall percentage of marks obtained in all subjects across all exams in the selected semester."),
          ],
          image: average_grade_performance,
        },
        {
          subheading: t("Extra Curricular Activities"),
          text: [
            t("It will highlights the student's participation in various extracurricular activities, showcasing their interests and skills outside the classroom."),
            t("It provides an overview of the student's involvement in clubs, sports, and community events, reflecting their commitment to personal growth and teamwork."),
          ],
          image: extra_curricular_activities_performance,
        },
        {
          subheading: t("Subject-Wise Detailed Lecture Review"),
          text: [
            t("It will display a detailed review of lectures for each subject as well as all subject, covering each week, months and the entire duration of the course."),
            t("This section offers a comprehensive overview of lecture content and student performance across time."),
          ],
          image: subject_wise_detailed_lecture_review_performance,
        },
        {
          subheading: t("Subject-Wise Detailed Attendance"),
          text: [
            t("It will display subject-wise attendance, including the number of days present, absent, and days with no lecture, for each subject on a weekly, monthly, and overall basis."),
          ],
          image: subject_wise_detailed_attendance_performance,
        },
        {
          subheading: t("Graph Visualization of Subject-wise Detailed Attendance"),
          text: [
            t("A graph representing attendance trends and comparing the total number of lectures attended to the total number of lectures held for each subject."),
          ],
          image: subject_wise_graph_visualization_of_attendance_performance,
        },
        {
          subheading: t("Marks Category-Wise"),
          text: [
            t("It will display the marks for each subject, as well as for all subjects, across categories including Interim, SLE, Practicals, Theory, and Total, along with the overall grade."),
          ],
          image: marks_category_wise_performance,
        },
        {
          subheading: t("Graphic Visualization of Marks by Category-wise"),
          text: [
            t("It will display a graph to visualize the student's performance, highlighting the total marks of the subjects with the highest and lowest scores."),
          ],
          image: Graph_visualization_of_marks_by_category_wise,
        },
      ],
    },
    {
      title: t("Future Insights"),
      content: [
        {
          subheading: t("Marks Prediction"),
          text: [
            t("The Performance Outlook provides an estimate of a student’s future performance based on key academic data."),
            t("Based on Attendance and Past Performance: Uses current semester attendance, last semester’s percentage, and marks from two semesters ago to estimate performance."),
            t("Estimation with Variability: The prediction can vary based on factors like exam preparation, assignments, and course engagement."),
            t("Updated Regularly: The outlook is refreshed as the semester progresses, ensuring it reflects the student’s most current data.")
          ],
          image: marks_image,
        },
        {
          subheading: t("Attendance Prediction"),
          text: [
            t("Considers factors such as: Students' analysis of teachers, Lecture timing and type of lectures, Day of the week"),
            t("Analyzes attendance patterns from previous weeks"),
            t("Predicts the likelihood of a student's presence for the upcoming timetable"),
            t("Estimation is based on available data and may vary"),
          ],
          image: attendance_image,
        },
      ],
    },
    {
      title: t("Faculty"),
      content: [
        {
          subheading: t("Overview"),
          text: [
            t("This page shows the faculty details of the student."),
            t("The teachers that have taught the student in the past and the teachers that are currently teaching the student."),
            t("Details about the faculty are also shown such has which semesters they have taught, and which subjects."),
          ],
          image: faculty_page_image,
        },
      ],
    },
    {
      title: t("Chat"),
      content: [
        {
          subheading: t("Overview"),
          text: [
            t("This page allows parents to ocassionally connect with the current semester's faculty."),
          ],
          image: chat_page_image,
        },
      ],
    },
    {
      title: t("Feedback"),
      content: [
        {
          subheading: t("Overview"),
          text: [
            t("This page allows parents to give their opinions about the faculty and the college as well as the interface they are using"),
            t("This feedback is taken into consideration by the college to improve the quality of education."),
            t("Improvements to the website can also be suggested here."),
          ],
          image: feedback_page_image,
        },
      ],
    },
    {
      title: t("Student Profile"),
      content: [
        {
          subheading: t("Overview"),
          text: [
            t("This page shows the student's profile details."),
            t("The student's name, roll number, email, phone number, and other details are shown here."),
          ],
          image: student_profile_page_image,
        },
      ],
    },
  ];

  const handlePrev = () => {
    if (selectedContentIndex > 0) {
      setSelectedContentIndex(selectedContentIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedContentIndex < guides.length - 1) {
      setSelectedContentIndex(selectedContentIndex + 1);
    }
  };

  const { title, content } = guides[selectedContentIndex];

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth 
      PaperProps={{
        style: {
          borderRadius: '8px', 
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          padding: '10px',
          paddingTop: '0px',
        }
      }}
    >
      <DialogTitle sx={{ position: 'relative', paddingBottom: '16px' }}>
        <Typography variant="h5" fontWeight="bold" sx={{ textAlign: 'center', marginBottom: '1rem' }}>
        {t("Navigating Your Child's Progress: A Parent's Handbook")}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button 
            onClick={handlePrev} 
            disabled={selectedContentIndex === 0}
            variant="contained" 
            color="secondary"
            sx={{ borderRadius: '50px', padding: '8px 20px', boxShadow: 2 }}
          >
            <Typography variant="button" fontWeight="bold" sx={{ color: 'white !important' }}>Previous</Typography>
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={selectedContentIndex === guides.length - 1}
            variant="contained" 
            color="primary"
            sx={{ borderRadius: '50px', padding: '8px 20px', boxShadow: 2 }}
          >
            <Typography variant="button" fontWeight="bold" sx={{ color: 'white !important' }}>Next</Typography>
          </Button>
        </Box>
        <hr style={{ border: "1px solid #ddd", margin: "16px 0", marginBottom: "24px" }} />
        <Typography variant="h5" fontWeight="bold" color="primary">{title}</Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{
            position: "absolute", 
            top: 8, 
            right: 8, 
            color: 'rgba(0, 0, 0, 0.7)',
            "&:hover": { color: 'black' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent 
        sx={{ 
          overflowX: "hidden", 
          paddingTop: "16px", 
          '&::-webkit-scrollbar': { width: '8px' }, 
          '&::-webkit-scrollbar-track': { backgroundColor: 'rgba(0, 0, 0, 0.1)' }, 
          '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '10px' } 
        }}
      >
        {content.map((section, index) => (
          <Box key={index} sx={{ marginBottom: "16px" }}>
            <Typography variant="h6" fontWeight="bold" color="tertiary" sx={{ marginBottom: "8px" }}>
              {section.subheading}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-evenly' }}>
              <ul style={{ listStyleType: "disc", paddingLeft: "20px", flex: 1 }}>
                {section.text.map((item, idx) => (
                  <li key={idx}>
                    <Typography sx={{ fontSize: '1rem' }} color="textSecondary">
                      {item}
                    </Typography>
                  </li>
                ))}
              </ul>
              <Box sx={{ marginLeft: { sm: '16px' }, marginTop: { xs: '16px', sm: '0' }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={section.image} alt="Guide" style={{ width: '100%', height: 'auto', maxWidth: '300px' }}/>
              </Box>
            </Box>
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default GuideModal;