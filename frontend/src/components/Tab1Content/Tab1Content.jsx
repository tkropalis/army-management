import { Box, Typography } from '@mui/joy';
import styles from '../../styles/tabContent.module.css';

export default function Tab1Content() {
  return (
    <Box className={styles.tabContent}>
      <Typography level="h2">Tab 1</Typography>
      <Box className={styles.contentArea}>
        {/* Tab 1 specific content will go here */}
      </Box>
    </Box>
  );
}
