import { Box, Typography } from '@mui/joy';
import styles from '../../styles/tabContent.module.css';

export default function Tab5Content() {
  return (
    <Box className={styles.tabContent}>
      <Typography level="h2">Tab 5</Typography>
      <Box className={styles.contentArea}>
        {/* Tab 5 specific content will go here */}
      </Box>
    </Box>
  );
}
