import React from 'react';
import { Typography, Box } from '@mui/material';
import api_loading from '../../assets/images/api.gif';
import ml_loading from '../../assets/images/algorithm.gif';
import enc_loading from '../../assets/images/secure.gif';

const LoadingScreen = ({ message }) => {
  const getLoadingIconForMessage = (message) => {
    switch (message) {
      case "Activating API's":
        return <img src={api_loading} alt="Activating API" width={50} height={50} />;
      case "Generating AI Insights":
        return <img src={ml_loading} alt="Generating AI Insights" width={50} height={50} />;
      case "Encrypting Data":
        return <img src={enc_loading} alt="Encrypting Data" width={50} height={50} />;
      default:
        return <img src={api_loading} alt="Loading" width={50} height={50} />;
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 9999,
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        {getLoadingIconForMessage(message)}
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingScreen;
