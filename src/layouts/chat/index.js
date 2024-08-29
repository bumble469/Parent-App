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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid
        container
        component={Paper}
        elevation={3}
        sx={{
          padding: 2,
          margin: "20px 0",
          backgroundColor: "#fff",
          height: "calc(100vh - 180px)",
          overflow: "hidden",
        }}
      >
        {/* Teacher List Section */}
        <Grid
          item
          xs={12}
          sx={{
            borderBottom: "1px solid #ddd",
            overflowX: "auto",
            whiteSpace: "nowrap",
          }}
        >
          <Box sx={{ display: "flex", overflowX: "auto", padding: 1 }}>
            {currentSemesterTeachers.map((teacher, index) => (
              <ListItem
                button
                key={index}
                selected={selectedTeacher === teacher}
                onClick={() => handleTeacherSelect(teacher)}
                sx={{ minWidth: "200px", marginRight: "8px", whiteSpace: "normal" }}
              >
                <ListItemIcon>
                  <Avatar alt={teacher.name} src={teacher.image} />
                </ListItemIcon>
                <ListItemText
                  primary={teacher.name}
                  secondary={`${teacher.title} - Teaches: ${
                    Array.isArray(teacher.subjects)
                      ? teacher.subjects.join(", ")
                      : "N/A"
                  }`}
                />
              </ListItem>
            ))}
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          sx={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              maxHeight: "calc(100vh - 250px)", // Adjust height to ensure space for the message input bar
              scrollbarWidth: "thin",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "rgba(0, 0, 0, 0.1)", // Light track color
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0, 0, 0, 0.3)", // Darker thumb color
                borderRadius: "10px", // Rounded scrollbar thumb
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#555",
              },
            }}
          >
            <List sx={{ paddingBottom: "56px" }}> {/* Ensure space for the input bar */}
              {selectedTeacher ? (
                <>
                  <ListItem key="1" sx={{ justifyContent: "flex-end" }}>
                    <Box
                      sx={{
                        backgroundColor: "#e0f7fa",
                        borderRadius: 2,
                        padding: 1,
                        maxWidth: "60%",
                      }}
                    >
                      <Typography variant="body1">Hey, how is it going?</Typography>
                      <Typography
                        variant="caption"
                        sx={{ textAlign: "right", display: "block" }}
                      >
                        09:30
                      </Typography>
                    </Box>
                  </ListItem>
                  <ListItem key="2" sx={{ justifyContent: "flex-start" }}>
                    <Box
                      sx={{
                        backgroundColor: "#f1f8e9",
                        borderRadius: 2,
                        padding: 1,
                        maxWidth: "60%",
                      }}
                    >
                      <Typography variant="body1">
                        Hello! All good here, how about you? - {selectedTeacher.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ textAlign: "right", display: "block" }}
                      >
                        09:31
                      </Typography>
                    </Box>
                  </ListItem>
                  <ListItem key="3" sx={{ justifyContent: "flex-end" }}>
                    <Box
                      sx={{
                        backgroundColor: "#e0f7fa",
                        borderRadius: 2,
                        padding: 1,
                        maxWidth: "60%",
                      }}
                    >
                      <Typography variant="body1">Doing great, thanks!</Typography>
                      <Typography
                        variant="caption"
                        sx={{ textAlign: "right", display: "block" }}
                      >
                        09:35
                      </Typography>
                    </Box>
                  </ListItem>
                  <ListItem key="4" sx={{ justifyContent: "flex-start" }}>
                    <Box
                      sx={{
                        backgroundColor: "#f1f8e9",
                        borderRadius: 2,
                        padding: 1,
                        maxWidth: "60%",
                      }}
                    >
                      <Typography variant="body1">
                        Actually, I have a question about the upcoming exam.
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ textAlign: "right", display: "block" }}
                      >
                        09:40
                      </Typography>
                    </Box>
                  </ListItem>
                  <ListItem key="5" sx={{ justifyContent: "flex-end" }}>
                    <Box
                      sx={{
                        backgroundColor: "#e0f7fa",
                        borderRadius: 2,
                        padding: 1,
                        maxWidth: "60%",
                      }}
                    >
                      <Typography variant="body1">
                        No, just wanted to check in. Thanks!
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ textAlign: "right", display: "block" }}
                      >
                        09:45
                      </Typography>
                    </Box>
                  </ListItem>
                  <ListItem key="6" sx={{ justifyContent: "flex-start" }}>
                    <Box
                      sx={{
                        backgroundColor: "#f1f8e9",
                        borderRadius: 2,
                        padding: 1,
                        maxWidth: "60%",
                      }}
                    >
                      <Typography variant="body1">
                        I’m unsure about the topics covered. Could you provide some guidance?
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ textAlign: "right", display: "block" }}
                      >
                        09:50
                      </Typography>
                    </Box>
                  </ListItem>
                  <ListItem key="7" sx={{ justifyContent: "flex-end" }}>
                    <Box
                      sx={{
                        backgroundColor: "#e0f7fa",
                        borderRadius: 2,
                        padding: 1,
                        maxWidth: "60%",
                      }}
                    >
                      <Typography variant="body1">Sure, what do you need to know?</Typography>
                      <Typography
                        variant="caption"
                        sx={{ textAlign: "right", display: "block" }}
                      >
                        09:55
                      </Typography>
                    </Box>
                  </ListItem>
                  <ListItem key="8" sx={{ justifyContent: "flex-start" }}>
                    <Box
                      sx={{
                        backgroundColor: "#f1f8e9",
                        borderRadius: 2,
                        padding: 1,
                        maxWidth: "60%",
                      }}
                    >
                      <Typography variant="body1">
                        I’m unsure about the topics covered. Could you provide some guidance?
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ textAlign: "right", display: "block" }}
                      >
                        10:00
                      </Typography>
                    </Box>
                  </ListItem>
                  <ListItem key="9" sx={{ justifyContent: "flex-end" }}>
                    <Box
                      sx={{
                        backgroundColor: "#e0f7fa",
                        borderRadius: 2,
                        padding: 1,
                        maxWidth: "60%",
                      }}
                    >
                      <Typography variant="body1">
                        I’ll send you an outline. Check your email for details.
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ textAlign: "right", display: "block" }}
                      >
                        10:05
                      </Typography>
                    </Box>
                  </ListItem>
                </>
              ) : (
                <Typography sx={{ padding: 2 }}>
                  Select a teacher to start chatting.
                </Typography>
              )}
            </List>
          </Box>
          <Divider />
          <Grid
            container
            sx={{ padding: 2, position: "sticky", bottom: 0, backgroundColor: "#fff" }}
          >
            <Grid item xs={11}>
              <TextField id="outlined-basic-message" label="Type Something" fullWidth />
            </Grid>
            <Grid item xs={1} align="right">
              <Fab color="primary" aria-label="send">
                <SendIcon />
              </Fab>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Footer />
    </DashboardLayout>
  );
}

export default Chat;
