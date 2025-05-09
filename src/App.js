import { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Sidenav from 'examples/Sidenav';
import theme from 'assets/theme';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import logo from 'assets/images/logo.png';
import Profile from './layouts/profile';
import Dashboard from './layouts/dashboard';
import Performance from './layouts/performance';
import Predictions from './layouts/predictions';
import Faculty from './layouts/faculty';
import Chat from './layouts/chat';
import Reporting from './layouts/reporting';
import { useMaterialUIController, setMiniSidenav } from 'context';
import { Typography, Icon } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LoadingScreen from './components/LoadingScreen';
import { SessionProvider } from './context/SessionContext';

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, direction, layout, sidenavColor, darkMode } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();
  const FLASK_ENC_API = process.env.REACT_APP_PARENT_FLASK_ENC_URL;
  const MACHINE_LEARNING_API = process.env.REACT_APP_PARENT_MACHINE_LEARNING_URL;
  const REST_API = process.env.REACT_APP_PARENT_REST_API_URL;
  const isHindi = useMemo(() => i18n.language !== 'en', [i18n.language]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Activating API's");
  const apiActivated = useRef(false); 

  useEffect(() => {
    document.body.setAttribute('dir', direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  useMemo(() => {
    setRtlCache(
      createCache({
        key: 'rtl',
        stylisPlugins: [rtlPlugin],
      })
    );
  }, []);

  const alternateMessages = () => {
    const messages = ["Activating API's", "Generating AI Insights", "Encrypting Data"];
    let index = 0;

    const interval = setInterval(() => {
      setMessage(messages[index]);
      index = (index + 1) % messages.length;
    }, 2500);

    return interval;
  };

  useEffect(() => {
    if (apiActivated.current) return;

    apiActivated.current = true; 

    const wakeUpEncryptionApi = async () => {
      try {
        setLoading(true);
        const [response, response1] = await Promise.all([
          axios.get(`${FLASK_ENC_API}/wakeup`),
          axios.get(`${MACHINE_LEARNING_API}/wakeup`),
          axios.get(`${REST_API}`),
        ]);

        if (response.status === 200 && response1.status === 200) {
          setMessage("All Set!");
          setTimeout(() => {
            setLoading(false);
          }, 1500);
        } else {
          throw new Error('One or more APIs failed');
        }
      } catch (error) {
        console.error("Error waking up API", error);
        setLoading(false);
      }
    };

    const messageInterval = alternateMessages();
    wakeUpEncryptionApi();

    return () => {
      clearInterval(messageInterval);
    };
  }, []);

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const routes = [
    { type: 'title', title: t('Home'), key: 'home' },
    {
      type: 'collapse',
      name: <Typography sx={{ fontSize: isHindi ? '1rem' : '0.9rem' }}>{t('Dashboard')}</Typography>,
      key: 'dashboard',
      icon: <Icon fontSize="small">dashboard</Icon>,
      route: '/dashboard',
      component: <Dashboard />,
    },
    { type: 'divider', key: 'home-divider' },
    { type: 'title', title: t('Analytics'), key: 'analytics' },
    {
      type: 'collapse',
      name: <Typography sx={{ fontSize: isHindi ? '1rem' : '0.9rem' }}>{t('Performance')}</Typography>,
      key: 'performance',
      icon: <Icon fontSize="small">bar_chart</Icon>,
      route: '/performance',
      component: <Performance />,
    },
    {
      type: 'collapse',
      name: <Typography sx={{ fontSize: isHindi ? '1rem' : '0.9rem' }}>{t('Future Insights')}</Typography>,
      key: 'Future-Insights',
      icon: <Icon fontSize="small">show_chart</Icon>,
      route: '/Future-Insights',
      component: <Predictions />,
    },
    { type: 'divider', key: 'analytics-divider' },
    { type: 'title', title: t('Staff and Communication'), key: 'communication' },
    {
      type: 'collapse',
      name: <Typography sx={{ fontSize: isHindi ? '1rem' : '0.9rem' }}>{t('Faculty')}</Typography>,
      key: 'faculty',
      icon: <Icon fontSize="small">people</Icon>,
      route: '/faculty',
      component: <Faculty />,
    },
    {
      type: 'collapse',
      name: <Typography sx={{ fontSize: isHindi ? '1rem' : '0.9rem' }}>{t('Chat')}</Typography>,
      key: 'chat',
      icon: <Icon fontSize="small">chat</Icon>,
      route: '/chat',
      component: <Chat />,
    },
    { type: 'divider', key: 'communication-divider' },
    { type: 'title', title: t('Reports'), key: 'summary-reports' },
    {
      type: 'collapse',
      name: <Typography sx={{ fontSize: isHindi ? '1rem' : '0.9rem' }}>{t('Feedback')}</Typography>,
      key: 'feedback',
      icon: <Icon fontSize="small">feedback</Icon>,
      route: '/feedback',
      component: <Reporting />,
    },
  ];

  const getRoutes = (allRoutes) =>
    allRoutes
      .filter((route) => route.route)
      .map((route) => <Route key={route.key} exact path={route.route} element={route.component} />);

  return (
    <SessionProvider>
      {loading ? (
        <LoadingScreen message={message} />
      ) : (
        <>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {layout === 'dashboard' && (
              <Sidenav
                color={sidenavColor}
                brand={logo}
                brandName="SCAS"
                routes={routes}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
              />
            )}
            <Routes>
              {getRoutes(routes)}
              <Route path="*" element={<Navigate to="/dashboard" />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </ThemeProvider>
        </>
      )}
    </SessionProvider>
  );
}
