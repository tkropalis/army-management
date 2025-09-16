import { Typography, Box, Grid, Card } from '@mui/joy';
import { motion } from 'framer-motion';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const stats = [
  { title: 'Active Personnel', value: '1,247', icon: <PeopleIcon />, color: '#B6CEB4' },
  { title: 'Missions', value: '23', icon: <AssignmentIcon />, color: '#96A78D' },
  { title: 'Readiness', value: '94%', icon: <TrendingUpIcon />, color: '#D9E9CF' },
];

export default function Dashboard() {
  return (
    <Box>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Typography 
          level="h2" 
          sx={{ 
            mb: 4, 
            color: '#F0F0F0',
            fontWeight: 700 
          }}
        >
          Dashboard
        </Typography>
      </motion.div>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid xs={12} sm={4} key={stat.title}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Card 
                sx={{ 
                  p: 3,
                  background: 'linear-gradient(145deg, #3d4837, #4a5544)',
                  border: '1px solid #96A78D',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                    transition: 'all 0.15s ease'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box 
                    sx={{ 
                      p: 1.5, 
                      borderRadius: '12px',
                      backgroundColor: `${stat.color}15`,
                      color: stat.color,
                      mr: 2 
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography level="body-sm" sx={{ color: '#96A78D' }}>
                    {stat.title}
                  </Typography>
                </Box>
                <Typography 
                  level="h3" 
                  sx={{ 
                    color: '#F0F0F0',
                    fontWeight: 600 
                  }}
                >
                  {stat.value}
                </Typography>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.2 }}
      >
        <Typography level="body-lg" sx={{ color: '#D9E9CF' }}>
          Welcome to the Army Management System. Use the navigation to explore different sections.
        </Typography>
      </motion.div>
    </Box>
  );
}
