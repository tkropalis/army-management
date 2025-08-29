import { Box, Typography, CssBaseline } from '@mui/joy';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import MainTabs from './components/MainTabs/MainTabs';
import styles from './styles/home.module.css';

const theme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        background: {
          body: 'var(--bg)',
        },
      },
    },
  },
});

export default function App() {
  return (
    <CssVarsProvider theme={theme} defaultMode="dark">
      <CssBaseline />
      <Box className={styles.container}>
        <Box className={styles.header}>
          <Typography level="h1">Army Management System</Typography>
        </Box>
        <Box className={styles.content}>
          <MainTabs />
        </Box>
      </Box>
    </CssVarsProvider>
  )
}
