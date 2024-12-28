import React, { useState, useEffect, useRef } from 'react';
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
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'; // Arrow icon
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile'; // Document icon
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';

function Chat() {
  const [teachers, setTeachers] = useState([]); // State to hold teachers data
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error handling
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  useEffect(() => {
    // Fetch teacher data from API
    const fetchTeachers = async () => {
      try {
        const response = await fetch('http://localhost:8001/api/chat/chat-list'); // Replace with your API URL
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTeachers(data); // Set teachers data from the API
      } catch (error) {
        setError(error.message); // Set error if any
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchTeachers();
  }, []); // Empty dependency array to run only once when the component mounts

  const chatMessages = [
    {
      sender: 'parent',
      message: 'Hey, how is it going?',
      time: '09:30',
    },
    {
      sender: 'teacher',
      message: 'Hello! All good here, how about you?',
      time: '09:31',
    },
    // ... (other chat messages)
  ];

  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current.click(); // Trigger the file input click
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected file:', file); // Handle file here
    }
  };
  
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Paper
        elevation={3}
        sx={{
          margin: '10px auto', // Center the Paper by using auto margins
          height: 'calc(100vh - 150px)', // Responsive height
          display: 'flex',
          overflow: 'hidden',
          position: 'relative',
          width: { xs: '95%', sm: '100%' }, // Adjust width for mobile
          padding: 2
        }}
      >
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              padding: 2,
              backgroundColor: 'grey'
            }}
          >
            <IconButton
              onClick={() => setDrawerOpen(false)}
              sx={{ alignSelf: 'flex-end', color: 'text.primary' }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Teachers
            </Typography>
            <List>
              {loading ? (
                <Typography>Loading...</Typography>
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                teachers.map((teacher, index) => (
                  <ListItem
                    button
                    key={index}
                    selected={selectedTeacher === teacher}
                    onClick={() => {
                      setSelectedTeacher(teacher);
                    }}
                    sx={{
                      marginBottom: { xs: 2, sm: 0 }, // Add margin below each list item in mobile view
                    }}
                  >
                    <ListItemIcon>
                      <Avatar
                        alt={teacher.teacher_fullname}
                        src={teacher.teacher_image ? teacher.teacher_image : 'default-image-url.jpg'} // Use the teacher's image
                        sx={{ width: 50, height: 50 }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: { xs: '1rem', sm: '0.9rem' },
                            fontWeight: 'bold'
                          }}
                        >
                          {`${teacher.teacher_fullname}`}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: { xs: '0.9rem', sm: '0.8rem' }, // Reduce font size in desktop view
                          }}
                        >
                          Subjects:&nbsp;{teacher.subject_name || 'No subject available'}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Box>
        </Drawer>

        {/* Teacher List Section for Desktop View */}
        <Box
          sx={{
            width: { xs: '100%', sm: '30%', md: '25%' }, // Responsive width
            borderRight: '1px solid #ddd',
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            padding: 2,
            height: '100%',
            overflowY: 'auto',
            '::-webkit-scrollbar': {
              width: '8px', // Width of the scrollbar
            },
            '::-webkit-scrollbar-thumb': {
              backgroundColor: '#888', // Color of the scrollbar thumb
              borderRadius: '4px',
            },
            '::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#555', // Color on hover
            },
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Teachers
          </Typography>
          <List>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              teachers.map((teacher, index) => (
                <ListItem
                  button
                  key={index}
                  selected={selectedTeacher === teacher}
                  onClick={() => {
                    setSelectedTeacher(teacher);
                  }}
                  sx={{
                    marginBottom: 3,
                    borderRadius: 2,
                    backgroundColor: selectedTeacher === teacher ? '#e3f2fd !important' : 'inherit',
                  }}
                >
                  <ListItemIcon>
                    <Avatar
                      alt={`${teacher.teacher_fullname}`}
                      src={teacher.teacher_image ? teacher.teacher_image : 'default-image-url.jpg'} // Use the teacher's image
                      sx={{ width: 50, height: 50 }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: { xs: '1rem', sm: '0.9rem' }, // Reduce font size in desktop view
                          fontWeight: 'bold'
                        }}
                      >
                        {`${teacher.teacher_fullname}`}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { xs: '0.9rem', sm: '0.8rem' }, // Reduce font size in desktop view
                        }}
                      >
                        Subject:&nbsp;{teacher.subject_name || 'No subject available'}
                      </Typography>
                    }
                  />
                </ListItem>
              ))
            )}
          </List>
        </Box>

        {/* Chat Section */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: 2,
            position: 'relative', // Position relative for absolute positioning of the button
          }}
        >
          {/* Mobile Menu Icon */}
          {isMobile && !drawerOpen && (
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{
                position: 'absolute',
                zIndex: 1300,
                color: 'text.primary', // Dark color for the icon
                left: -5,
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          )}

          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              maxHeight: 'calc(100% - 60px)', // Adjust based on input height
              paddingBottom: '16px',
            }}
          >
            <List>
              {selectedTeacher ? (
                chatMessages.map((msg, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      justifyContent: msg.sender === 'parent' ? 'flex-end' : 'flex-start',
                      marginBottom: 1,
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: msg.sender === 'parent' ? '#f1f1f1' : '#e1f5fe',
                        borderRadius: '8px',
                        padding: 1,
                        maxWidth: '60%',
                        wordWrap: 'break-word',
                      }}
                    >
                      <Typography variant="body1"
                      sx={{ fontSize: '0.85rem' }}>{msg.message}</Typography>
                      <Typography variant="caption" sx={{ display: 'block', textAlign: 'right' }}>
                        {msg.time}
                      </Typography>
                    </Box>
                  </ListItem>
                ))
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    color: 'grey.500', // Grey color
                    marginTop: "7rem"
                  }}
                >
                  <Typography>Select a teacher to start chatting.</Typography>
                </Box>
              )}
            </List>
          </Box>

          <Divider />

          {/* Input Field Section */}
          <Grid container spacing={2} alignItems="center" sx={{ padding: 1 }}>
            <Grid item xs>
              <TextField
                variant="outlined"
                placeholder="Type a message..."
                fullWidth
                inputProps={{
                  style: {
                    fontSize: '0.875rem', // Reduce input font size
                  },
                }}
              />
            </Grid>
            <Grid item>
              <Fab
                color="primary"
                onClick={() => console.log('Send message')}
                sx={{ marginLeft: 1 }}
              >
                <SendIcon />
              </Fab>
            </Grid>
            <Grid item>
              <IconButton onClick={handleFileClick}>
                <AttachFileIcon />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }} // Hide the default file input
                />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      <Footer />
    </DashboardLayout>
  );
}

export default Chat;
