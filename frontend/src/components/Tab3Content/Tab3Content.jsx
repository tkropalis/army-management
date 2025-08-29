import { Box, Typography } from '@mui/joy';
import styles from '../../styles/tabContent.module.css';

export default function Tab3Content() {
  return (
    <Box className={styles.tabContent}>
      <Typography level="h2">Tab 3</Typography>
      <Box className={styles.contentArea}>
        {/* Tab 3 specific content will go here */}
      </Box>
    </Box>
  );
}
