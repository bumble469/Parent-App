import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Grid, Paper, MenuItem } from '@mui/material';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import emailjs from 'emailjs-com';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useSession } from '../../context/SessionContext';
import { toast, ToastContainer } from 'react-toastify';
function FeedbackPage() {
  const {session} = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedbackType, setFeedbackType] = useState('General Feedback');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState('');
  const [errors, setErrors] = useState({});
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language != 'en';
  const prn = session.studentId || 0;
  const REST_API_URL = process.env.REACT_APP_PARENT_REST_API_URL;
  const sendEmail = (e) => {
    e.preventDefault();
    const templateParams = {
      to_name: name,
      to_email: email,
      feedback_type: feedbackType,
      feedback_rating: rating,
      feedback_body: feedback,
    };
    emailjs.send('service_85cp6qt', 'template_zu5zdkd', templateParams, '24y_NZ0sWWKtDZw3J')
      .then((result) => {
      })
      .catch((error) => {
      });
  };

  const validateForm = () => {
    const newErrors = {};
  
    if (!name) {
      newErrors.name = t('errors.nameRequired');
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email) {
      newErrors.email = t('errors.emailRequired');
    } else if (!emailRegex.test(email)) {
      newErrors.email = t('errors.invalidEmail');
    }
  
    if (!rating) {
      newErrors.rating = t('errors.ratingRequired');
    } else if (isNaN(rating) || rating < 1 || rating > 10) {
      newErrors.rating = t('errors.invalidRating');
    }
  
    const feedbackWordsCount = feedback.trim().split(/\s+/).length;
    if (!feedback) {
      newErrors.feedback = t('errors.feedbackRequired');
    } else if (feedbackWordsCount > 80) {
      newErrors.feedback = t('errors.feedbackLimit');
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };
  let toastMailSent;
  let toastMailFailed;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
        const feedbackData = {
            feedbackType,
            feedbackRating: rating,
            feedbackBody: feedback,
            dateTime: new Date().toISOString() 
        };

        try {
            const response = await axios.post(`${REST_API_URL}/api/feedback/feedback-insert`, {
                prn,
                feedbackData,
            });
            if (response.status === 200) { 
                sendEmail(e);
                toastMailSent = toast.success(t("thankYouMessage"),{ position: 'top-center', autoClose: 2000 })
                handleClear();
            } else {
                toastMailFailed = toast.error(t("errorMessage"),{ position: 'top-center', autoClose: 2000 })
            }
        } catch (error) {
            let toastError;
            console.error('Error sending feedback:', error);
            toastError = toast.error(t("errorMessage"),{ position: 'top-center', autoClose: false });
        }
    }
};

  const handleClear = () => {
    setName('');
    setEmail('');
    setFeedbackType('General Feedback');
    setFeedback('');
    setRating('');
    setErrors({});
  };

  return (
    <DashboardLayout sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <DashboardNavbar />
      <Box sx={{ flex: 1, padding: { xs: 2, sm: 3 }, display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: 900 }}>
          <Paper elevation={6} sx={{ padding: 4, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 600, marginBottom: '1.2rem' }}>
              {t('title')}
            </Typography>
            <Typography variant="subtitle2" gutterBottom align="left" sx={{ fontWeight: 300, marginBottom: '1.2rem' }}>
              {t('subtitle')}
            </Typography>
            <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('name')}
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={Boolean(errors.name)}
                    helperText={errors.name}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('email')}
                    type="email"
                    variant="outlined"
                    name="email_to"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('feedbackType')}
                    variant="outlined"
                    select
                    value={feedbackType}
                    onChange={(e) => setFeedbackType(e.target.value)}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        height: '2.7rem',
                      },
                    }}
                  >
                    <MenuItem value="General Feedback">{t('generalFeedback')}</MenuItem>
                    <MenuItem value="Feature Suggestion">{t('featureSuggestion')}</MenuItem>
                    <MenuItem value="Bug Report">{t('bugReport')}</MenuItem>
                    <MenuItem value="Testimonial">{t('testimonial')}</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('rating')}
                    type="number"
                    variant="outlined"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    inputProps={{ min: 1, max: 10 }}
                    error={Boolean(errors.rating)}
                    helperText={errors.rating}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                      '& input': {
                        textAlign: 'center',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('yourFeedback')}
                    variant="outlined"
                    multiline
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    error={Boolean(errors.feedback)}
                    helperText={errors.feedback}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{
                        marginTop: 2,
                        '&.MuiButton-containedPrimary': {
                          color: 'white !important',
                          background: 'linear-gradient(90deg, #3D97EE, #257EEA)',
                          fontSize: isHindi ? '1.02rem' : '0.78rem',
                        },
                        width: { xs: '100%', sm: 'auto' },  // Make button take full width on small screens
                      }}
                    >
                      {t('submitFeedback')}
                    </Button>
                    <Button
                      onClick={handleClear}
                      type="button"
                      variant="contained"
                      color="error"
                      sx={{
                        marginTop: 2,
                        '&.MuiButton-containedError': {
                          color: 'white !important',
                          backgroundColor: 'rgb(159, 0, 0, 0.7)',
                          border: '1px solid #f5c6cb',
                          fontSize: isHindi ? '0.95rem' : '0.78rem',
                        },
                        width: { xs: '100%', sm: 'auto' },  // Make button take full width on small screens
                      }}
                    >
                      {t('clear')}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>
      </Box>
      <Footer />
    </DashboardLayout>
  );
}

export default FeedbackPage;
