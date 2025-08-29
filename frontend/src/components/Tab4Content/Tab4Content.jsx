import { Box, Typography } from '@mui/joy';
import styles from '../../styles/tabContent.module.css';

export default function Tab4Content() {
  return (
    <Box className={styles.tabContent}>
      <Typography level="h2">Tab 4</Typography>
      <Box className={styles.contentArea}>
        {/* Tab 4 specific content will go here */}
      </Box>
    </Box>
  );
}
