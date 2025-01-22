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

const GuideModal = ({ isOpen, onClose = () => {} }) => {
  const [selectedContentIndex, setSelectedContentIndex] = useState(0);

  const guides = [
    {
      title: "Dashboard",
      content: [
        {
          subheading: "Overview",
          text: [
            "The Dashboard page gives an overview of the student's current semester's progress. Includes attendance, performance, strong or weak points, low attendance, and upcoming events.",
          ],
          image: dashboard_image,
        },
        {
          subheading: "Overall Attendance",
          text: [
            "This Overall Attendance shows the average attendance of all the subjects until now.",
            "If the attendance is below 75%, then the parent must take action."
          ],
          image: overallAttendance_image,
        },
        {
          subheading: "Overall Performance",
          text: [
            "This shows the overall percentage of the student based on marks obtained up till now.",
            "If the percentage is below 60%, then the parent must take action.",
            "This will be visible only after an exam has been conducted otherwise nothing is there to show!"
          ],
          image: overallPerformance_image,
        },
        {
            subheading: "Rating",
            text: [
                "This is an out-of-5 metric that combines current performance and attendance.",
                "It works on the criteria of 60% marks and 40% attendance."
            ],
            image: rating_image,
        },
        {
            subheading: "Subject-Wise Attendance Bar Graph",
            text: [
              "A subject-wise graphical view of how much attendance has been taken in each subject.",
              "A parent can easily see which subject is being neglected by the student and by how much.",
              "It displays the lectures attended and total lectures in each subject."
            ],
            image: subjectWiseAttendance_image,
        },
        {
            subheading: "Subject-Wise Performance Line Graph",
            text: [
              "This shows the marks obtained in all types of exams in each subject.",
              "It will be visible only after an exam has been conducted otherwise nothing is there to show!"
            ],
            image: subjectWisePerformance_image,
        },
        {
            subheading: "Strong Subjects",
            text: [
                "The subjects above 80% are considered strong subjects.",
                "Visible only after an exam has been conducted otherwise nothing is there to show!"
            ],
            image: strongSubjects_image,
        },
        {
            subheading: "Weak Subjects",
            text: [
                "The subjects below 75% are considered weak subjects.",
                "Visible only after an exam has been conducted otherwise nothing is there to show!"
            ],
            image: weakSubjects_image,
        },
        {
            subheading: "Low Attendance Subjects",
            text: [
                "Subjects below 75% attendance are considered low attendance subjects.",
                "Action must be taken by the parent to improve the attendance in that subject."
            ],
            image: lowAttendanceSubjects_image,
        },
        {
            subheading: "Upcoming Events",
            text: [
                "This shows the upcoming events in the college including timetables, exams, etc.",
            ],
            image: upcomingEvents_image,
        },
      ],
    },
    {
        title: "Performance",
        content: [
          {
            subheading: "Overview",
            text: [
              "The Performance page gives in detail information about all the past as well as current semester",
              "It includes overall attendance, marks, lecture video review, detailed attendance, detailed marks."
            ],
          },
        ],
    },
    {
        title: "Predictions",
        content: [
          {
            subheading: "Overview",
            text: [
              "This page shows the predictions of the student's future performance based on the current performance and attendance as well as previous data.",
              "The stats showed in this are just to give an idea of what might happen in the future.",
              "Parent must take action if the predictions are not good."
            ],
          },
        ],
    },
    {
        title: "Faculty",
        content: [
          {
            subheading: "Overview",
            text: [
              "This page shows the faculty details of the student.",
              "The teachers that have taught the student in the past and the teachers that are currently teaching the student.",
              "Details about the faculty are also shown such has which semesters they have taught, and which subjects."
            ],
          },
        ],
    },
    {
        title: "Chat",
        content: [
          {
            subheading: "Overview",
            text: [
              "This page allows parents to ocassionally connect with the current semester's faculty.",
            ],
          },
        ],
    },
    {
        title: "Feedback",
        content: [
          {
            subheading: "Overview",
            text: [
              "This page allows parents to give their opinions about the faculty and the college as well as the interface they are using",
              "This feedback is taken into consideration by the college to improve the quality of education.",
              "Improvements to the website can also be suggested here."
            ],
          },
        ],
    },
    {
        title: "Student Profile",
        content: [
          {
            subheading: "Overview",
            text: [
              "This page shows the student's profile details.",
              "The student's name, roll number, email, phone number, and other details are shown here.",
            ],
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
          Navigating Your Child's Progress: A Parent's Handbook
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
