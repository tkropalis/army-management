import { Box, List, ListItem, ListItemButton, ListItemDecorator, Typography } from '@mui/joy';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, key: 'dashboard' },
  { label: 'Soldier Info', icon: <PeopleIcon />, key: 'soldier' },
  { label: 'Units', icon: <ListAltIcon />, key: 'units' },
  { label: 'Reports', icon: <AssessmentIcon />, key: 'reports' },
  { label: 'Settings', icon: <SettingsIcon />, key: 'settings' },
];

export default function Sidebar({ selected, onSelect }) {
  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Box 
        sx={{ 
          width: 280, 
          minHeight: '100vh', 
          p: 3, 
          background: 'linear-gradient(145deg, #3d4837 0%, #4a5544 100%)',
          borderRight: '1px solid #96A78D',
          boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background decoration */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100px',
          height: '100px',
          background: 'linear-gradient(45deg, rgba(182, 206, 180, 0.15), rgba(217, 233, 207, 0.1))',
          borderRadius: '50%',
          transform: 'translate(50%, -50%)'
        }} />
        
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <Typography 
            level="h3" 
            sx={{ 
              mb: 4, 
              textAlign: 'center',
              fontWeight: 700,
              background: 'linear-gradient(45deg, #B6CEB4, #D9E9CF)',
              backgroundClip: 'text',
              color: 'transparent',
              fontSize: '1.3rem',
              position: 'relative',
              zIndex: 1
            }}
          >
            Navigation
          </Typography>
        </motion.div>
        
        <List sx={{ gap: 1 }}>
          {navItems.map((item, index) => (
            <ListItem key={item.key}>
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.05 + index * 0.03 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ width: '100%' }}
              >
                <ListItemButton 
                  selected={selected === item.key} 
                  onClick={() => onSelect(item.key)}
                  sx={{
                    borderRadius: '12px',
                    p: 2,
                    transition: 'all 0.15s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      backgroundColor: 'rgba(182, 206, 180, 0.15)',
                      transform: 'translateX(4px)',
                      boxShadow: '0 4px 12px rgba(182, 206, 180, 0.2)'
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(182, 206, 180, 0.2)',
                      color: '#D9E9CF',
                      boxShadow: '0 4px 20px rgba(182, 206, 180, 0.25)',
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '3px',
                        backgroundColor: '#B6CEB4',
                      }
                    }
                  }}
                >
                  <ListItemDecorator sx={{ 
                    minInlineSize: 28,
                    color: selected === item.key ? '#D9E9CF' : '#B6CEB4',
                    transition: 'all 0.15s ease'
                  }}>
                    <motion.div
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ duration: 0.15 }}
                    >
                      {item.icon}
                    </motion.div>
                  </ListItemDecorator>
                  <Typography 
                    level="title-sm" 
                    sx={{ 
                      fontWeight: selected === item.key ? 600 : 500,
                      ml: 1,
                      color: selected === item.key ? '#D9E9CF' : '#F0F0F0'
                    }}
                  >
                    {item.label}
                  </Typography>
                </ListItemButton>
              </motion.div>
            </ListItem>
          ))}
        </List>
      </Box>
    </motion.div>
  );
}
