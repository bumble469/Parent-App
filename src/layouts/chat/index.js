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
  IconButton,
  Paper,
  useTheme,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import MDBox from 'components/MDBox';
import loading_image from '../../assets/images/icons8-loading.gif';
import { useMediaQuery } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { useSession } from '../../context/SessionContext';
import rightslideicon from '../../assets/images/right-slide-chat.png';
function Chat() {
  const { session } = useSession();
  const parentId = session.parentId || 0;
  const prn = session.studentId || 0;
  const theme = useTheme();
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [errorTeachers, setErrorTeachers] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [errorMessages, setErrorMessages] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const REST_API_URL = process.env.REACT_APP_PARENT_REST_API_URL;
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const { t } = useTranslation();
  function adjustTime(timestamp) {
    const time = new Date(timestamp);
    time.setHours(time.getHours() + 6);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.post(`${REST_API_URL}/api/chat/chat-list`, {
          prn,
        });
        const data = response.data;
        setTeachers(data);
      } catch (error) {
        setErrorTeachers(error.message);
      } finally {
        setLoadingTeachers(false);
      }
    };

    fetchTeachers();
  }, []);

  const loadMessages = async (teacherId) => {
    setLoadingMessages(true);
    setErrorMessages(null);
    try {
      const response = await axios.get(`${REST_API_URL}/api/chat/chats`, {
        params: { parentId, teacherId },
      });
      setMessages(response.data);
    } catch (error) {
      setErrorMessages(error.message);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (selectedTeacher) {
      loadMessages(selectedTeacher.teacher_id);
    } else {
      setMessages([]);
    }
  }, [selectedTeacher]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTeacher) return;

    try {
      await axios.post(`${REST_API_URL}/api/chat/chats`, {
        parentId,
        teacherId: selectedTeacher.teacher_id,
        senderType: 'Parent',
        message: newMessage,
        filePath: null,
      });

      setNewMessage('');
      loadMessages(selectedTeacher.teacher_id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box pt={2}>
        <Grid container spacing={2} style={{ height: '90vh' }}>
          <Grid item xs={12} style={{ height: 'fit-content' }}>
            <Paper
              style={{
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '90vh',
                overflow: 'hidden',
                borderRadius: '8px', // Added rounded corners
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Added subtle shadow
              }}
            >
              <Grid container spacing={2}>
                {isMobile ? (
                  <>
                    <IconButton
                        onClick={toggleSidebar}
                        sx={{
                          position: 'sticky',
                          top: '2px', 
                          left: '0px',
                          zIndex: 1,
                          backgroundColor: 'transparent', 
                          height: '1.35rem',
                          width: '1.35rem',
                          marginBottom: '0.3rem',
                        }}
                      >
                        <img 
                          src={rightslideicon} 
                          height={15}
                          width={15}
                          className="responsive-icon" 
                          style={{background: 'transparent'}} 
                        />
                      </IconButton>
                    <Drawer
                      anchor="left"
                      open={sidebarOpen}
                      onClose={toggleSidebar}
                      sx={{
                        display: { xs: 'block', sm: 'none' },
                      }}
                    >
                      <Box p={2} style={{ width: '250px' }}>
                        <Typography variant="h6">{t('Teacher List')}</Typography>
                        <Divider style={{ margin: '8px 0' }} />
                        {loadingTeachers ? (
                          <div style={{ textAlign: 'center', padding: '50px' }}>
                            <img
                              src={loading_image}
                              alt="Loading..."
                              style={{ width: '50px', height: '50px' }}
                            />
                          </div>
                        ) : errorTeachers ? (
                          <Typography color="error">{errorTeachers}</Typography>
                        ) : (
                          <List style={{ flexGrow: 1, overflowY: 'auto' }}>
                            {teachers.map((teacher) => (
                              <div key={teacher.teacher_id}>
                                <ListItem
                                  button
                                  selected={selectedTeacher && selectedTeacher.teacher_id === teacher.teacher_id}
                                  onClick={() => {
                                    setSelectedTeacher(teacher);
                                    toggleSidebar(); // This will close the Drawer when a teacher is selected
                                  }}
                                  style={{ padding: '0.5rem 0.3rem' }}
                                >
                                  <ListItemIcon>
                                    <Avatar
                                      alt={teacher.teacher_fullname}
                                      src={teacher.teacher_image || 'https://via.placeholder.com/40'}
                                    />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={
                                      <Typography variant="body2" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                        {teacher.teacher_fullname}
                                      </Typography>
                                    }
                                    secondary={
                                      <MDBox>
                                        <Typography
                                          variant="caption"
                                          color="textSecondary"
                                          style={{ fontSize: '0.75rem', marginBottom: '4px' }}
                                        >
                                          <strong>Subject:</strong> {teacher.subject_name}
                                        </Typography>
                                        <br />
                                        <Typography
                                          variant="caption"
                                          color="textSecondary"
                                          style={{ fontSize: '0.75rem', marginBottom: '4px' }}
                                        >
                                          <strong>Type:</strong> {teacher.teacher_type}
                                        </Typography>
                                      </MDBox>
                                    }
                                  />
                                </ListItem>
                                <Divider style={{ margin: '4px 0' }} />
                              </div>
                            ))}
                          </List>
                        )}
                      </Box>
                    </Drawer>
                  </>
                ) : (
                  // Teacher List Panel (Non-mobile version)
                  <Grid
                    item
                    xs={12}
                    md={3}
                    sx={{
                      maxHeight: 'calc(90vh - 64px)',
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
                    <Typography variant="h6">{t('Teacher List')}</Typography>
                    <Divider style={{ margin: '8px 0' }} />
                    {loadingTeachers ? (
                      <div style={{ textAlign: 'center', padding: '50px' }}>
                        <img
                          src={loading_image}
                          alt="Loading..."
                          style={{ width: '50px', height: '50px' }}
                        />
                      </div>
                    ) : errorTeachers ? (
                      <Typography color="error">{errorTeachers}</Typography>
                    ) : (
                      <List style={{ flexGrow: 1, overflowY: 'auto' }}>
                        {teachers.map((teacher) => (
                          <div key={teacher.teacher_id}>
                            <ListItem
                              button
                              selected={selectedTeacher && selectedTeacher.teacher_id === teacher.teacher_id}
                              onClick={() => setSelectedTeacher(teacher)}
                              sx={{
                                paddingRight: '1rem',
                                paddingTop: '0.3rem', // Reduced padding for tighter spacing
                                paddingTop: '0.3rem', // Reduced padding for tighter spacing
                                borderRadius: '8px', // Add rounded corners
                                marginBottom: '8px', // Space between items (optional)
                              }}
                            >
                              <ListItemIcon>
                                <Avatar
                                  alt={teacher.teacher_fullname}
                                  src={teacher.teacher_image || 'https://via.placeholder.com/40'}
                                  sx={{
                                    marginLeft: '8px', // Move it a bit to the right
                                    marginTop: '-4px', // Move it a bit up
                                  }}
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography variant="body2" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                    {teacher.teacher_fullname}
                                  </Typography>
                                }
                                secondary={
                                  <MDBox>
                                    <Typography
                                      variant="caption"
                                      color="textSecondary"
                                      style={{ fontSize: '0.75rem', marginBottom: '4px' }} // Smaller text
                                    >
                                      <strong>Subject:</strong> {teacher.subject_name}
                                    </Typography>
                                    <br />
                                    <Typography
                                      variant="caption"
                                      color="textSecondary"
                                      style={{ fontSize: '0.75rem', marginBottom: '4px' }} // Smaller text
                                    >
                                      <strong>Type:</strong> {teacher.teacher_type}
                                    </Typography>
                                  </MDBox>
                                }
                              />
                            </ListItem>

                            <Divider style={{ margin: '4px 0' }} />
                          </div>
                        ))}
                      </List>
                    )}
                  </Grid>
                )}

                {/* Chat Panel */}
                <Grid
                  item
                  xs={12}
                  md={9}
                  sx={{
                    height: 'calc(80vh - 15px)', // Adjust height for the chat container
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {selectedTeacher ? (
                    <>
                      <Typography variant="h6">{`Chat with ${selectedTeacher.teacher_fullname}`}</Typography>
                      <Divider style={{ margin: '8px 0' }} />

                      {/* Chat messages area */}
                        <Box
                          sx={{
                            flexGrow: 1, // Take remaining space above the input
                            padding: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: 'rgba(0, 0, 0, 0.05)', // Slightly darkened background color
                            borderRadius: '8px', // Optional: Add border radius for rounded corners
                            boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.1)', // Optional: Inner shadow for better visual separation
                            height: 'calc(80vh - 50px)', // Adjust height so it fits within the available space
                            overflowY: 'auto', // Enable vertical scrolling when the content exceeds the height
                            overflowX: 'hidden', 
                            scrollbarWidth: 'thin', // Optional: Makes the scrollbar thinner (Firefox)
                            '::-webkit-scrollbar': {
                              width: '8px', // Width of the scrollbar
                            },
                            '::-webkit-scrollbar-thumb': {
                              backgroundColor: '#888', // Color of the scrollbar thumb
                              borderRadius: '4px',
                            },
                            '::-webkit-scrollbar-thumb:hover': {
                              backgroundColor: '#555', // Color of the scrollbar thumb when hovered
                            },
                          }}
                          >
                        {loadingMessages ? (
                          <Typography style={{ fontSize: '0.75rem' }}>{t('Loading messages...')}</Typography>
                        ) : errorMessages ? (
                          <Typography color="error" style={{ fontSize: '0.75rem' }}>
                            {errorMessages}
                          </Typography>
                        ) : messages.length === 0 ? (
                          <Typography style={{ fontSize: '0.9rem' }}>
                            {t('No messages found. Start the conversation!')}
                          </Typography>
                        ) : (
                          messages.map((msg) => (
                            <Box
                              key={msg.MessageID}
                              mb={1}
                              p={2}
                              borderRadius={2}
                              bgcolor={msg.SenderType === 'Parent' ? '#a8e0a1' : '#ffffff'} // WhatsApp-like colors
                              style={{
                                alignSelf: msg.SenderType === 'Teacher' ? 'flex-start' : 'flex-end', // Align Teacher's messages to the left and Parent's to the right
                                width: 'auto', // Width adjusts to content
                                minWidth: '100px', // Ensure the message box does not shrink too much
                                maxWidth: '70%', // Prevents it from growing too large
                                position: 'relative',
                                wordWrap: 'break-word', // Ensure long text breaks properly
                                flexDirection: 'column', // Flex to keep the timestamp at the bottom
                                padding: '10px', // Consistent padding
                              }}
                            >
                              {/* Message Content */}
                              <Typography
                                variant="body2"
                                style={{
                                  fontSize: '0.8rem',
                                  marginBottom: '1px', // Control the margin to avoid overlapping
                                  position: 'relative', // Required for positioning the message inside the box
                                  top: '-5px', // This moves the message slightly upwards inside the box
                                }}
                              >
                                {msg.Message}
                              </Typography>

                              {/* Timestamp */}
                              <Typography
                                variant="caption"
                                style={{
                                  position: 'absolute',
                                  bottom: -1, // Position timestamp at the bottom of the box
                                  right: 5,
                                  color: '#888',
                                  fontSize: '0.7rem',
                                  padding: '0.2rem', // Added padding to make it more spaced out
                                }}
                              >
                                {adjustTime(msg.Timestamp)}
                              </Typography>

                              {/* Arrow Indicator */}
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: '25%',
                                  transform: 'translateY(-50%)',
                                  [msg.SenderType === 'Teacher' ? 'left' : 'right']: '-10px', // Place the arrow to the left for Teacher and right for Parent
                                  width: 0,
                                  height: 0,
                                  borderLeft: msg.SenderType === 'Teacher' ? '10px solid transparent' : 'none',
                                  borderRight: msg.SenderType === 'Parent' ? '10px solid transparent' : 'none',
                                  borderTop: `10px solid ${msg.SenderType === 'Teacher' ? '#ffffff' : '#a8e0a1'}`, // Arrow color matches message background
                                }}
                              />
                            </Box>
                          ))
                        )}
                      </Box>

                      <Divider
                        style={{
                          margin: '8px 0',
                          background: 'linear-gradient(to right, rgba(0, 0, 0, 0) 0%, #333 50%, rgba(51, 51, 51, 0) 100%)', // Gradient from transparent to dark and back to transparent
                          height: '2px', // Divider thickness
                        }}
                      />

                        {/* Input and button area (fixed at the bottom) */}
                        <Box 
                          display="flex" 
                          alignItems="center" 
                          style={{
                            position: 'sticky',
                            bottom: 0,
                            backgroundColor: theme.palette.background.paper,
                            padding: '0.2rem',
                            zIndex: 1,
                          }}
                        >
                          <TextField
                            fullWidth
                            variant="outlined"
                            placeholder={t('Type your message...')}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            style={{
                              borderRadius: '1rem',
                              marginRight: '1rem', // Space between input and buttons
                            }}
                          />
                          <IconButton
                            onClick={sendMessage}
                            sx={{
                              transition: 'transform 0.2s ease, color 0.2s ease',
                              '&:hover': {
                                transform: 'scale(1.2)',
                                color: theme.palette.primary.main,
                              },
                            }}
                          >
                            <SendIcon />
                          </IconButton>
                        </Box>
                      </>
                    ) : (
                      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <Typography variant="h6">{t('Select a teacher to start chatting')}</Typography>
                      </Box>
                    )}
                  </Grid>

                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        <Footer />
      </DashboardLayout>
    );
  }

  export default Chat;
