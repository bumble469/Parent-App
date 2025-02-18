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
import { PredictAttendance } from './data/attendancePrediction';
function Prediction() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
        <Grid>
            <PredictMarks />
        </Grid>
        <Grid>
          <PredictAttendance/>
        </Grid>
      <Footer />
    </DashboardLayout>
  );
}

export default Prediction;
