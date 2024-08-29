import React, { useState } from "react";
import {
  Box,
  Grid,
  Divider,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Fab,
  Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import facultyData from "../faculty/data/data"; // Adjust the path as needed

function Chat() {
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // Filtering teachers who are currently teaching in the current semester
  const currentSemesterTeachers = facultyData.teachingStaff.filter(
    (teacher) => teacher.currentSem
  );

  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(teacher);
  };

  const chatMessages = [
    {
      sender: "student",
      message: "Hey, how is it going?",
      time: "09:30",
    },
    {
      sender: "teacher",
      message: "Hello! All good here, how about you?",
      time: "09:31",
    },
    {
      sender: "student",
      message: "I wanted to ask about the project submission.",
      time: "09:32",
    },
    {
      sender: "teacher",
      message: "The deadline is next Friday. Do you need any help?",
      time: "09:33",
    },
    {
      sender: "student",
      message: "Yes, I'm struggling with the report format.",
      time: "09:34",
    },
    {
      sender: "teacher",
      message: "No worries, I'll send you a template.",
      time: "09:35",
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Paper
        elevation={3}
        sx={{
          padding: 1,
          margin: "10px 0",
          height: "calc(100vh - 150px)", // Responsive height
          overflow: "hidden",
        }}
      >
        {/* Teacher List Section */}
        <Grid
          container
          sx={{
            borderBottom: "1px solid #ddd",
            overflowX: "auto",
            padding: "4px 0",
            gap: 1,
            flexWrap: "nowrap", // Ensures horizontal scrolling if needed
          }}
        >
          {currentSemesterTeachers.map((teacher, index) => (
            <ListItem
              button
              key={index}
              selected={selectedTeacher === teacher}
              onClick={() => handleTeacherSelect(teacher)}
              sx={{
                minWidth: "100px", // Smaller width
                maxWidth: "120px", // Limiting max width for consistency
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <ListItemIcon sx={{ justifyContent: "center" }}>
                <Avatar
                  alt={teacher.name}
                  src={teacher.image}
                  sx={{ width: 50, height: 50 }} // Smaller avatar size
                />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  fontSize: "0.9rem", // Smaller font size
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
                secondaryTypographyProps={{
                  fontSize: "0.75rem", // Smaller font size for secondary text
                  textAlign: "center",
                  lineHeight: 1.1,
                }}
                primary={teacher.name}
                secondary={
                  Array.isArray(teacher.subjects)
                    ? teacher.subjects.join(", ")
                    : "N/A"
                }
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              />
            </ListItem>
          ))}
        </Grid>

        {/* Chat Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            overflow: "hidden",
            padding: "8px 0",
            height: "calc(100vh - 230px)", // Ensures the chat section fills the remaining space
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              maxHeight: "100%", // Full use of available space
            }}
          >
            <List sx={{ paddingBottom: "56px" }}>
              {selectedTeacher ? (
                chatMessages.map((msg, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      justifyContent:
                        msg.sender === "student" ? "flex-end" : "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor:
                          msg.sender === "student" ? "#e0f7fa" : "#f1f8e9",
                        borderRadius: 2,
                        padding: 1,
                        maxWidth: "60%",
                      }}
                    >
                      <Typography
                        variant="body2" // Smaller text for chat bubbles
                        sx={{ fontSize: "0.9rem" }}
                      >
                        {msg.message}{" "}
                        {msg.sender === "teacher" && `- ${selectedTeacher.name}`}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ textAlign: "right", display: "block" }}
                      >
                        {msg.time}
                      </Typography>
                    </Box>
                  </ListItem>
                ))
              ) : (
                <Typography
                  sx={{
                    padding: 2,
                    fontSize: "0.75rem",
                    textAlign: "center",
                  }}
                >
                  Select a teacher to start chatting.
                </Typography>
              )}
            </List>
          </Box>
          <Divider />
          {/* Message Input Section */}
          <Grid
            container
            sx={{
              padding: 1,
              position: "sticky",
              bottom: 15,
              backgroundColor: "#fff",
            }}
          >
            <Grid item xs={11}>
              <TextField
                id="outlined-basic-message"
                label="Type Something"
                fullWidth
                sx={{
                  backgroundColor: "#f9f9f9",
                  borderRadius: 1,
                  "& .MuiInputBase-input": {
                    fontSize: "0.75rem", // Smaller input text size
                  },
                }}
              />
            </Grid>
            <Grid item xs={1} align="right">
              <Fab
                size="small" // Smaller button size
                color="primary"
                aria-label="send"
                sx={{
                  minWidth: 36,
                  height: 36,
                }}
              >
                <SendIcon fontSize="small" />
              </Fab>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      <Footer />
    </DashboardLayout>
  );
}

export default Chat;
