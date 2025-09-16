
import { Box, Typography, CssBaseline } from '@mui/joy';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './components/Dashboard';
import SoldierInfo from './components/SoldierInfo';
import Units from './components/Units';
import Reports from './components/Reports';
import Settings from './components/Settings';
import PageTransition from './components/PageTransition';
import styles from './styles/home.module.css';
import { useState } from 'react';
import { motion } from 'framer-motion';

const theme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        background: {
          body: '#2a3129',
          surface: '#3d4837',
          level1: '#4a5544',
          level2: '#96A78D',
        },
        primary: {
          50: '#F0F0F0',
          100: '#D9E9CF',
          500: '#B6CEB4',
          600: '#96A78D',
          700: '#7a8a71',
        },
        text: {
          primary: '#F0F0F0',
          secondary: '#D9E9CF',
        },
      },
    },
  },
});

export default function App() {
  const [selectedTab, setSelectedTab] = useState('dashboard');

  let ContentComponent;
  switch (selectedTab) {
    case 'dashboard':
      ContentComponent = <Dashboard />;
      break;
    case 'soldier':
      ContentComponent = <SoldierInfo />;
      break;
    case 'units':
      ContentComponent = <Units />;
      break;
    case 'reports':
      ContentComponent = <Reports />;
      break;
    case 'settings':
      ContentComponent = <Settings />;
      break;
    default:
      ContentComponent = <Dashboard />;
  }

  return (
    <CssVarsProvider theme={theme} defaultMode="dark">
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        minHeight: '100vh', 
        backgroundColor: 'background.body',
        backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(150, 167, 141, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(182, 206, 180, 0.08) 0%, transparent 50%)'
      }}>
        <Sidebar selected={selectedTab} onSelect={setSelectedTab} />
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden'
        }}>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Box sx={{ 
              p: 4, 
              borderBottom: '1px solid', 
              borderColor: 'divider',
              backgroundColor: 'background.surface',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <Typography level="h1" sx={{ fontSize: '2.5rem' }}>
                Army Management System
              </Typography>
            </Box>
          </motion.div>
          
          <Box sx={{ 
            flex: 1, 
            p: 4, 
            overflow: 'auto',
            backgroundColor: 'background.body'
          }}>
            <PageTransition pageKey={selectedTab}>
              {ContentComponent}
            </PageTransition>
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
