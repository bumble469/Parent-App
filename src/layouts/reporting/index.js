import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Grid, Paper } from '@mui/material';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';

function FeedbackPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedbackType, setFeedbackType] = useState('General Feedback');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your feedback!');
    setName('');
    setEmail('');
    setFeedbackType('General Feedback');
    setFeedback('');
    setRating('');
  };

  return (
    <DashboardLayout sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <DashboardNavbar />
      <Box sx={{ flex: 1, padding: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Share Your Feedback
        </Typography>
        <Paper elevation={3} sx={{ padding: 3, maxWidth: 800, margin: 'auto' }}>
          <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name (Optional)"
                  variant="outlined"
                  margin="normal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email (Optional)"
                  type="email"
                  variant="outlined"
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Feedback Type"
                  variant="outlined"
                  margin="normal"
                  select
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="General Feedback">General Feedback</option>
                  <option value="Feature Suggestion">Feature Suggestion</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Testimonial">Testimonial</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Rating (1-5)"
                  type="number"
                  variant="outlined"
                  margin="normal"
                  inputProps={{ min: 1, max: 5 }}
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Your Feedback"
                  variant="outlined"
                  margin="normal"
                  multiline
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    marginTop: 2,
                    width: '100%',
                    '&.MuiButton-containedPrimary': {
                      color: 'white !important',
                    },
                  }}
                >
                  Submit Feedback
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
      <Footer />
    </DashboardLayout>
  );
}

export default FeedbackPage;
