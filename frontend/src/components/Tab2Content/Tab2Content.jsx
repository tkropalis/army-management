import { Box, Typography } from '@mui/joy';
import styles from '../../styles/tabContent.module.css';

export default function Tab2Content() {
  return (
    <Box className={styles.tabContent}>
      <Typography level="h2">Tab 2</Typography>
      <Box className={styles.contentArea}>
        {/* Tab 2 specific content will go here */}
      </Box>
    </Box>
  );
}
