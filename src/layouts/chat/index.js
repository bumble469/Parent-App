import React, { useState, useRef } from "react";
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
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  Input
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"; // Arrow icon
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile"; // Document icon
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import facultyData from "../faculty/data/data"; // Adjust the path as needed

function Chat() {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Filtering teachers who are currently teaching in the current semester
  const currentSemesterTeachers = facultyData.teachingStaff.filter(
    (teacher) => teacher.currentSem
  );

  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(teacher);
    if (isMobile) {
      setDrawerOpen(false); // Close drawer on mobile after selecting a teacher
    }
  };

  const chatMessages = [
    {
      sender: "parent",
      message: "Hey, how is it going?",
      time: "09:30",
    },
    {
      sender: "teacher",
      message: "Hello! All good here, how about you?",
      time: "09:31",
    },
    {
      sender: "parent",
      message: "I wanted to ask about the project submission.",
      time: "09:32",
    },
    {
      sender: "teacher",
      message: "The deadline is next Friday. Do you need any help?",
      time: "09:33",
    },
    {
      sender: "parent",
      message: "Yes, I'm struggling with the report format.",
      time: "09:34",
    },
    {
      sender: "teacher",
      message: "No worries, I'll send you a template.",
      time: "09:35",
    },
  ];
  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current.click(); // Trigger the file input click
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file); // Handle file here
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          margin: "10px 0",
          height: "calc(100vh - 150px)", // Responsive height
          display: "flex",
          overflow: "hidden",
          position: "relative", // Position relative to contain the toggler button
        }}
      >
        {/* Drawer for Mobile View */}
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: 240,
              boxSizing: "border-box",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              padding: 2,
            }}
          >
            <IconButton
              onClick={() => setDrawerOpen(false)}
              sx={{ alignSelf: "flex-end", color: "text.primary" }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Teachers
            </Typography>
            <List>
              {currentSemesterTeachers.map((teacher, index) => (
                <ListItem
                  button
                  key={index}
                  selected={selectedTeacher === teacher}
                  onClick={() => handleTeacherSelect(teacher)}
                >
                  <ListItemIcon>
                    <Avatar
                      alt={teacher.name}
                      src={teacher.image}
                      sx={{ width: 50, height: 50 }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={teacher.name}
                    secondary={teacher.subjects.join(", ")}
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Teacher List Section for Desktop View */}
        <Box
          sx={{
            width: { xs: "100%", sm: "30%", md: "25%" }, // Responsive width
            borderRight: "1px solid #ddd",
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            padding: 2,
            height: "100%",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Teachers
          </Typography>
          <List>
            {currentSemesterTeachers.map((teacher, index) => (
              <ListItem
                button
                key={index}
                selected={selectedTeacher === teacher}
                onClick={() => handleTeacherSelect(teacher)}
                sx={{
                  marginBottom: 1,
                  borderRadius: 2,
                  backgroundColor: selectedTeacher === teacher ? "#e3f2fd !important" : "inherit",
                }}
              >
                <ListItemIcon>
                  <Avatar
                    alt={teacher.name}
                    src={teacher.image}
                    sx={{ width: 50, height: 50 }}
                  />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                    textAlign: "left",
                  }}
                  secondaryTypographyProps={{
                    fontSize: "0.75rem",
                    textAlign: "left",
                  }}
                  primary={teacher.name}
                  secondary={teacher.subjects.join(", ")}
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Chat Section */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: 2,
            position: "relative", // Position relative for absolute positioning of the button
          }}
        >
          {/* Mobile Menu Icon */}
          {isMobile && !drawerOpen && (
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{
                position: "absolute",
                zIndex: 1300,
                color: "text.primary", // Dark color for the icon
                left: -5,
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          )}

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              maxHeight: "calc(100% - 60px)", // Adjust based on input height
              paddingBottom: "16px",
            }}
          >
            <List>
              {selectedTeacher ? (
                chatMessages.map((msg, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      justifyContent:
                        msg.sender === "parent" ? "flex-end" : "flex-start",
                      marginBottom: 2, // Add space below each message
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor:
                          msg.sender === "parent" ? "#f1f8e9" : "#e0f7fa",
                        borderRadius: 2,
                        padding: 1,
                        maxWidth: "60%",
                      }}
                    >
                      <Typography
                        variant="body2"
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
              bottom: 0,
              backgroundColor: "#fff",
              alignItems: "center", // Align items center vertically
            }}
          >
            <Grid item xs={1}>
              <Fab
                color="info"
                aria-label="attach-file"
                disabled={!selectedTeacher} // Disable when no teacher is selected
                onClick={handleFileClick} // Trigger file input click
                size="small" // Adjust the size as needed
              >
                <AttachFileIcon />
              </Fab>
              <Input
                type="file"
                inputRef={fileInputRef}
                onChange={handleFileChange}
                sx={{ display: "none" }} // Hide the file input
              />
            </Grid>

            <Grid item xs={10}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Type a message..."
                disabled={!selectedTeacher} // Disable when no teacher is selected
              />
            </Grid>
            <Grid item xs={1}>
              <Fab
                color="info"
                aria-label="send"
                size="small"
                disabled={!selectedTeacher} // Disable when no teacher is selected
              >
                <SendIcon />
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
