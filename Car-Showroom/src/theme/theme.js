import { createTheme } from '@mui/material/styles'

export const autovistaTheme = createTheme({
  palette: {
    primary: { main: '#e10600' },
    background: { default: '#f3f3f1', paper: '#ffffff' },
    text: { primary: '#090909', secondary: '#777777' },
  },
  typography: { fontFamily: 'Arial, sans-serif' },
  shape: { borderRadius: 2 },
})
