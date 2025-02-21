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
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Drawer from '@mui/material/Drawer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSession } from '../../context/SessionContext';
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

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.post('https://parent-rest-api.onrender.com/api/chat/chat-list', {
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
      const response = await axios.get('https://parent-rest-api.onrender.com/api/chat/chats', {
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
      await axios.post('https://parent-rest-api.onrender.com/api/chat/chats', {
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
                      style={{
                        position: 'sticky',
                        top: '2px', // Adjust position to your liking
                        left: '0px',
                        zIndex: 1,
                        backgroundColor: 'grey', // Styling the button
                        height: '1.35rem',
                        width: '1.35rem',
                        marginBottom:'0.3rem'
                      }}
                    >
                      {sidebarOpen ? (
                        <ArrowBackIcon style={{ color: 'white' }} /> // Arrow to collapse sidebar
                      ) : (
                        <ArrowForwardIcon style={{ color: 'white' }} /> // Arrow to open sidebar
                      )}
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
                              style={{ paddingRight:'1rem', paddingTop:'0.3rem' }} // Reduced padding for tighter spacing
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
                            <Divider style={{ margin: '4px 0' }} /> {/* Separator between items */}
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
                          overflowY: 'auto', // Make the messages scrollable
                          padding: 1,
                          display: 'flex',
                          flexDirection: 'column',
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
                              p={1}
                              borderRadius={4}
                              bgcolor={msg.SenderType === 'Parent' ? '#e0f7fa' : '#fce4ec'}
                              style={{
                                alignSelf: msg.SenderType === 'Parent' ? 'flex-end' : 'flex-start', // Use alignSelf for positioning
                                maxWidth: '55%',
                                marginBottom: '0.25rem',
                              }}
                            >
                              <Typography variant="body2" style={{ fontSize: '0.9rem' }}>
                                <strong>
                                  {msg.SenderType === 'Parent' ? 'You' : selectedTeacher.teacher_fullname || 'Teacher'}
                                </strong>{' '}
                                <br />
                                {msg.Message}
                              </Typography>
                              <Typography variant="caption" style={{ color: '#888', fontSize: '0.7rem' }}>
                                {msg.Timestamp.split("T")[0]} {msg.Timestamp.split("T")[1].split(".")[0]}
                              </Typography>
                            </Box>
                          ))
                        )}
                      </Box>

                      <Divider style={{ margin: '8px 0' }} />

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
