import Dashboard from 'layouts/dashboard';
import Performance from 'layouts/performance';
import Predictions from 'layouts/predictions';
import Faculty from 'layouts/faculty';
import Chat from 'layouts/chat';
import Reporting from 'layouts/reporting';

import Icon from '@mui/material/Icon';
import Typography from '@mui/material/Typography';

const routes = [
  {
    type: 'title',
    title: 'Home',
    key: 'home',
  },
  {
    type: 'collapse',
    name: (
      <Typography sx={{ fontFamily: '"Noto Sans", sans-serif', fontSize: '0.9rem' }}>
        Dashboard
      </Typography>
    ),
    key: 'dashboard',
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: '/dashboard',
    component: <Dashboard />,
  },
  {
    type: 'divider',
    key: 'home-divider',
  },
  {
    type: 'title',
    title: 'Analytics',
    key: 'analytics',
  },
  {
    type: 'collapse',
    name: (
      <Typography sx={{ fontFamily: '"Noto Sans", sans-serif', fontSize: '0.9rem' }}>
        Performance
      </Typography>
    ),
    key: 'performance',
    icon: <Icon fontSize="small">bar_chart</Icon>,
    route: '/performance',
    component: <Performance />,
  },
  {
    type: 'collapse',
    name: (
      <Typography sx={{ fontFamily: '"Noto Sans", sans-serif', fontSize: '0.9rem' }}>
        Predictions
      </Typography>
    ),
    key: 'predictions',
    icon: <Icon fontSize="small">show_chart</Icon>,
    route: '/predictions',
    component: <Predictions />,
  },
  {
    type: 'divider',
    key: 'analytics-divider',
  },
  {
    type: 'title',
    title: 'Staff and Communication',
    key: 'communication',
  },
  {
    type: 'collapse',
    name: (
      <Typography sx={{ fontFamily: '"Noto Sans", sans-serif', fontSize: '0.9rem' }}>
        Faculty
      </Typography>
    ),
    key: 'faculty',
    icon: <Icon fontSize="small">people</Icon>,
    route: '/faculty',
    component: <Faculty />,
  },
  {
    type: 'collapse',
    name: (
      <Typography sx={{ fontFamily: '"Noto Sans", sans-serif', fontSize: '0.9rem' }}>
        Chat
      </Typography>
    ),
    key: 'chat',
    icon: <Icon fontSize="small">chat</Icon>,
    route: '/chat',
    component: <Chat />,
  },
  {
    type: 'divider',
    key: 'communication-divider',
  },
  {
    type: 'title',
    title: 'Summary and Reports',
    key: 'summary-reports',
  },
  {
    type: 'collapse',
    name: (
      <Typography sx={{ fontFamily: '"Noto Sans", sans-serif', fontSize: '0.9rem' }}>
        Feedback
      </Typography>
    ),
    key: 'feedback',
    icon: <Icon fontSize="small">feedback</Icon>,
    route: '/feedback',
    component: <Reporting />,
  },
];

export default routes;
