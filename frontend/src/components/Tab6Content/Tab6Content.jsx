import { Box, Typography } from '@mui/joy';
import styles from '../../styles/tabContent.module.css';

export default function Tab6Content() {
  return (
    <Box className={styles.tabContent}>
      <Typography level="h2">Tab 6</Typography>
      <Box className={styles.contentArea}>
        {/* Tab 6 specific content will go here */}
      </Box>
    </Box>
  );
}
