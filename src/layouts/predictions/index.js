import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import Grid from '@mui/material/Grid';

import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';

ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend);
import { PredictMarks } from './data/marksPredictions';

function Prediction() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
        <Grid>
            <PredictMarks />
        </Grid>
      <Footer />
    </DashboardLayout>
  );
}

export default Prediction;
