import { useState } from 'react';
import { Box, Typography, Select, Option, Card } from '@mui/joy';
import { motion } from 'framer-motion';

const soldiers = [
  { id: 1, name: 'John Doe', rank: 'Sergeant', unit: 'Alpha', age: 28, service: '5 years' },
  { id: 2, name: 'Jane Smith', rank: 'Lieutenant', unit: 'Bravo', age: 32, service: '8 years' },
  { id: 3, name: 'Alex Johnson', rank: 'Corporal', unit: 'Charlie', age: 25, service: '3 years' },
];

export default function SoldierInfo() {
  const [selectedId, setSelectedId] = useState(soldiers[0].id);
  const soldier = soldiers.find(s => s.id === selectedId);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Typography 
          level="h2" 
          sx={{ 
            mb: 3, 
            color: '#F0F0F0',
            fontWeight: 700 
          }}
        >
          Soldier Information
        </Typography>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.05 }}
      >
        <Select 
          value={selectedId} 
          onChange={(_, v) => setSelectedId(v)} 
          sx={{ 
            mb: 3, 
            minWidth: 250,
            backgroundColor: '#4a5544',
            '& .MuiSelect-button': {
              backgroundColor: '#4a5544',
              border: '1px solid #96A78D',
              color: '#F0F0F0'
            }
          }}
        >
          {soldiers.map(s => (
            <Option key={s.id} value={s.id}>{s.name}</Option>
          ))}
        </Select>
      </motion.div>
      
      {soldier && (
        <motion.div
          key={soldier.id}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <Card 
            variant="outlined" 
            sx={{ 
              maxWidth: 500,
              background: 'linear-gradient(145deg, #3d4837, #4a5544)',
              border: '1px solid #96A78D',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              p: 4
            }}
          >
            <Typography 
              level="h3" 
              sx={{ 
                mb: 3, 
                color: '#B6CEB4',
                fontWeight: 600 
              }}
            >
              {soldier.name}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                                  <Typography level="body-sm" sx={{ color: '#96A78D', mb: 0.5 }}>
                    Rank
                  </Typography>
                  <Typography level="body-lg" sx={{ color: '#F0F0F0', fontWeight: 500 }}>
                    {soldier.rank}
                  </Typography>
                </Box>
                <Box>
                  <Typography level="body-sm" sx={{ color: '#96A78D', mb: 0.5 }}>
                    Unit
                  </Typography>
                  <Typography level="body-lg" sx={{ color: '#F0F0F0', fontWeight: 500 }}>
                    {soldier.unit}
                  </Typography>
                </Box>
                <Box>
                  <Typography level="body-sm" sx={{ color: '#96A78D', mb: 0.5 }}>
                    Age
                  </Typography>
                  <Typography level="body-lg" sx={{ color: '#F0F0F0', fontWeight: 500 }}>
                    {soldier.age} years old
                  </Typography>
                </Box>
                <Box>
                  <Typography level="body-sm" sx={{ color: '#96A78D', mb: 0.5 }}>
                    Years of Service
                  </Typography>
                  <Typography level="body-lg" sx={{ color: '#F0F0F0', fontWeight: 500 }}>
                    {soldier.service}
                  </Typography>
                </Box>
            </Box>
          </Card>
        </motion.div>
      )}
    </Box>
  );
}
